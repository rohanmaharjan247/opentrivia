import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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

  seconds = 6;
  showSeconds = false;

  secondInterval: any;

  answerTimer = 30;
  answerInterval: any;

  gameOver = false;
  byTime = false;
  byWrongAnswer = false;

  loading = false;

  constructor(
    private questionService: OpenTriviaService,
    private activatedRoute: ActivatedRoute,
    private title:Title
  ) {
    this.categoryId = +activatedRoute.snapshot?.params?.id ?? 0;
    this.title.setTitle('Question - Quiz Trivia')
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

  startAnswerTimer() {
    this.answerInterval = setInterval(() => {
      if (this.answerTimer > 0) this.answerTimer--;
      else {
        this.gameOver = true;
        this.byTime = true;
        this.title.setTitle('Game Over - Quiz Trivia')
        clearInterval(this.answerInterval);
      }
    }, 1000);
  }

  getAnyQuestion() {
    this.loading = true;
    this.questionService
      .getAnyQuestion()
      .pipe(takeUntil(this.toUnsubscribe$))
      .subscribe((data) => {
        this.triviaQuestion = data;
        this.startAnswerTimer();
        this.reset();
        this.loading = false;
      });
  }

  getCategoryQuestion() {
    this.loading = true;
    if (this.categoryId > 0) {
      this.questionService
        .getCategoryQuestion(String(this.categoryId))
        .pipe(takeUntil(this.toUnsubscribe$))
        .subscribe((data) => {
          this.triviaQuestion = data;
          this.startAnswerTimer();
          this.reset();
          this.loading = false;
        });
    }
  }

  restart() {
    this.gameOver = false;
    this.byTime = false;
    this.byWrongAnswer = false;
    this.score = 0;
    this.reset();
    clearInterval(this.answerInterval);
    if(this.categoryId > 0) this.getCategoryQuestion();
    else this.getAnyQuestion();
  }

  choiceMade(choice: string) {
    if (this.madeChoice) return;
    this.madeChoice = true;
    this.selectedChoice = choice;
    this.showSeconds = true;

    clearInterval(this.answerInterval);
    if (choice === this.triviaQuestion?.correct_answer) {

      this.madeChoice = false;
      this.correctChoice = true;
      this.score += 100;
      this.startTimer();
      setTimeout(() => {
        if (this.categoryId > 0) this.getCategoryQuestion();
        else this.getAnyQuestion();
      }, 6000);
    } else {
      this.correctChoice = true;

      this.byWrongAnswer = true;
      this.title.setTitle('Game Over - Quiz Trivia')
      this.startTimer();
      setTimeout(() => {
        this.gameOver = true;
      }, 6000);
    }
  }

  startTimer() {
    this.secondInterval = setInterval(() => {
      this.seconds--;
    }, 1000);
  }

  reset() {
    this.madeChoice = false;
    this.correctChoice = false;
    this.selectedChoice = '';
    this.seconds = 6;
    this.showSeconds = false;
    this.answerTimer = 30;
    clearInterval(this.secondInterval);
    //  clearInterval(this.answerInterval);
  }
}
