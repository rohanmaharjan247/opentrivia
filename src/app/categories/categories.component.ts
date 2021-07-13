import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [
    {
      id: 9,
      category: 'General Knowledge',
    },
    {
      id: 10,
      category: 'Books',
    },
    {
      id: 11,
      category: 'Film',
    },
    {
      id: 12,
      category: 'Music',
    },
    {
      id: 13,
      category: 'Musical & Theatres',
    },
    {
      id: 14,
      category: 'Television',
    },
    {
      id: 15,
      category: 'Video Games',
    },
    {
      id: 16,
      category: 'Board Games',
    },
    {
      id: 17,
      category: 'Science & Nature',
    },
    {
      id: 18,
      category: 'Computers',
    },
    {
      id: 19,
      category: 'Mathematics',
    },

    {
      id: 20,
      category: 'Mythology',
    },
    {
      id: 21,
      category: 'Sports',
    },
    {
      id: 22,
      category: 'Geography',
    },
    {
      id: 23,
      category: 'History',
    },
    {
      id: 24,
      category: 'Politics',
    },

    {
      id: 25,
      category: 'Art',
    },

    {
      id: 26,
      category: 'Celebrities',
    },
    {
      id: 27,
      category: 'Animals',
    },

    {
      id: 28,
      category: 'Vehicles',
    },

    {
      id: 29,
      category: 'Comics',
    },
    {
      id: 30,
      category: 'Gadgets',
    },
    {
      id: 31,
      category: 'Japanese Anime & Manga',
    },

    {
      id: 32,
      category: 'Cartoon & Animations',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
