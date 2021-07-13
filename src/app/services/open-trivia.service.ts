import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class OpenTriviaService {
  constructor(
    @Inject('BASE_API') public baseUrl: string,
    private httpClient: HttpClient
  ) {}

  getAnyQuestion = () =>
    this.httpClient
      .get<Question>(`${this.baseUrl}`, {
        params: new HttpParams()
          .set('amount', String(1))
          .set('type', 'multiple')
          .set('difficulty', 'easy'),
      })
      .pipe(
        catchError(this.handleErrores),
        map((result: any) => {
          let questionResult = result?.results?.[0];
          let questions: Question = {
            category: questionResult?.category ?? '',
            choices: this.shuffle([
              ...questionResult?.incorrect_answers,
              questionResult.correct_answer,
            ]),
            correct_answer: questionResult.correct_answer,
            difficulty: questionResult.difficulty,
            incorrect_answers: questionResult.incorrect_answers,
            question: questionResult.question,
            type: questionResult.type,
          };
          return questions;
        })
      );

  getCategoryQuestion = (category: string) =>
    this.httpClient
      .get<Question>(`${this.baseUrl}`, {
        params: new HttpParams()
          .set('amount', String(1))
          .set('type', 'multiple')
          .set('category', category)          
          .set('difficulty', 'easy'),
      })
      .pipe(
        catchError(this.handleErrores),
        map((result: any) => {
          let questionResult = result?.results?.[0];
          let questions: Question = {
            category: questionResult?.category ?? '',
            choices: this.shuffle([
              ...questionResult?.incorrect_answers,
              questionResult.correct_answer,
            ]),
            correct_answer: questionResult.correct_answer,
            difficulty: questionResult.difficulty,
            incorrect_answers: questionResult.incorrect_answers,
            question: questionResult.question,
            type: questionResult.type,
          };
          return questions;
        })
      );

  private shuffle(array: string[]) {
    var currentIndex = array.length,
      randomIndex;
    //While there remains elements to shuffle
    while (0 !== currentIndex) {
      //pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      //and swap it with the current element
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  private handleErrores(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(`An error occured`, error.error);
    } else {
      console.error(
        `A backend error with status ${error.status}, body was`,
        error.error
      );
    }

    return throwError(`A problem occured! Please try again later!`);
  }
}
