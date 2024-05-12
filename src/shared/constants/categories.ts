import music from "@assets/img/categories/music.jpg";
import podcast from "@assets/img/categories/podcast.jpg";
import gaming from "@assets/img/categories/game.jpg";
import news from "@assets/img/categories/news.jpg";
import coding from "@assets/img/categories/coding.jpg";
import sports from "@assets/img/categories/sports.jpg";
import graphics from "@assets/img/categories/graphics.jpg";
import lifestyle from "@assets/img/categories/lifestyle.jpg";
import nature from "@assets/img/categories/nature.jpg";
import demo from "@assets/img/categories/demo.jpg";

export type CategoryInfo = {
  categoryName: string;
  exampleImage: string;
  description: string;
  selectionConditions: {
    backendCategories: string[];
    textThreshold: number;
  };
};

export const categories: { [key: string]: CategoryInfo } = {
  music: {
    categoryName: "Music",
    exampleImage: music,
    description: "Music includes music videos and live performances",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1
    }
  },
  podcast: {
    categoryName: "Podcast",
    exampleImage: podcast,
    description:
      "Podcast is about all podcast content including interviews and panel discussions",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1
    }
  },
  gaming: {
    categoryName: "Gaming",
    exampleImage: gaming,
    description:
      "Gaming focuses on in-game content, including gameplays and walkthroughs",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1
    }
  },
  news: {
    categoryName: "News",
    exampleImage: news,
    description:
      "News focuses on news headlines and videos that include worldwide updates",
    selectionConditions: {
      backendCategories: ["news"],
      textThreshold: 1
    }
  },
  coding: {
    categoryName: "Coding",
    exampleImage: coding,
    description:
      "Coding includes programming and coding content, such as coding tutorials",
    selectionConditions: {
      backendCategories: ["textHeavy"],
      textThreshold: 1
    }
  },
  sports: {
    categoryName: "Sports",
    exampleImage: sports,
    description:
      "Sports is for all sports-related content, such as match highlights and in-game moments",
    selectionConditions: {
      backendCategories: ["sports"],
      textThreshold: 1
    }
  },
  graphics: {
    categoryName: "Graphics",
    exampleImage: graphics,
    description:
      "Graphics covers animations and a variety of visually creative videos",
    selectionConditions: {
      backendCategories: ["graphics"],
      textThreshold: 1
    }
  },
  lifestyle: {
    categoryName: "Lifestyle",
    exampleImage: lifestyle,
    description:
      "Lifetyle covers vlogs and a variety of content where people are the subject",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1
    }
  },
  nature: {
    categoryName: "Nature",
    exampleImage: nature,
    description:
      "Nature is for wildlife documentaries, scenic travel vlogs, and nature exploration videos",
    selectionConditions: {
      backendCategories: ["nature"],
      textThreshold: 1
    }
  },
  demo: {
    categoryName: "Demo",
    exampleImage: demo,
    description:
      "Demo covers all types of demonstration videos, such as product unboxings and practical guides",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1
    }
  }
} as const;
