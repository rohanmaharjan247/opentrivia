import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Question } from '../models/question.model';
import { OpenTriviaService } from '../services/open-trivia.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss'],
})
export class AskQuestionComponent implements OnInit, OnDestroy {
  private toUnsubscribe$ = new Subject<void>();

  triviaQuestion!: Question;

  categoryId = 0;

  madeChoice = false;
  correctChoice = false;
  selectedChoice = '';

  score = 0;

  seconds = 3;
  showSeconds = false;

  secondInterval:any;

  constructor(
    private questionService: OpenTriviaService,
    private activatedRoute: ActivatedRoute
  ) {
    this.categoryId = +activatedRoute.snapshot?.params?.id ?? 0;
  }
  ngOnDestroy(): void {
    this.toUnsubscribe$.next();
    this.toUnsubscribe$.complete();
  }

  ngOnInit(): void {
    if (this.categoryId > 0) {
      this.getCategoryQuestion();
    } else {
      this.getAnyQuestion();
    }
  }

  getAnyQuestion() {
    this.questionService
      .getAnyQuestion()
      .pipe(takeUntil(this.toUnsubscribe$))
      .subscribe((data) => {
        this.triviaQuestion = data;
        this.reset();
      });
  }

  getCategoryQuestion() {
    if (this.categoryId > 0) {
      this.questionService
        .getCategoryQuestion(String(this.categoryId))
        .pipe(takeUntil(this.toUnsubscribe$))
        .subscribe((data) => {
          this.triviaQuestion = data;
          this.reset();
        });
    }
  }

  choiceMade(choice: string) {
    if (this.madeChoice) return;
    this.madeChoice = true;
    this.selectedChoice = choice;
    this.showSeconds = true;
    if (choice === this.triviaQuestion?.correct_answer) {
      this.madeChoice = false;
      this.correctChoice = true;
      this.score += 100;
    } else {
      this.correctChoice = true;
    }
    this.startTimer();
    setTimeout(() => {
      if (this.categoryId > 0) this.getCategoryQuestion();
      else this.getAnyQuestion();
    }, 2000);
  }

  startTimer(){
    this.secondInterval = setInterval(() => {
      this.seconds--;
    }, 1000);
  }

  reset() {
    this.madeChoice = false;
    this.correctChoice = false;
    this.selectedChoice = '';
    this.seconds = 3;
    this.showSeconds = false;
    clearInterval(this.secondInterval);
  }
}
