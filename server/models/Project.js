const mongoose = require('mongoose')
const {Schema, model} = mongoose;

const ProjectSchema = new Schema(
  {
    title: { type: String, require: true },
    createdBy: { type: Schema.Types.ObjectID, ref: "User" },
    author: String,
    genre: String,
    summary: String,
    cover: String,
    setting: {
      description: String,
      timePeriod: String,
      location: String,
      pictures: [String],
      countries: [
        {
          name: String,
          borders: String,
          capital: String,
          culture: String,
          economy: String,
          food: String,
          location: String,
          pictures: [String],
          population: String,
          weather: String,
          wildlife: String,
          cities: [
            {
              name: String,
              architecture: String,
              characteristics: String,
              crime: String,
              culture: String,
              economy: String,
              food: String,
              location: String,
              picture: String,
              population: String,
              province: String,
              size: String,
              technology: String,
              terrain: String,
              weather: String,
              wildlife: String,
            },
          ],
          landmarks: [
            {
              name: String,
              description: String,
              location: String,
              picture: String,
            },
          ],
        },
      ],
      lands: [
        {
          name: String,
          description: String,
          location: String,
          pictures: [String],
          terrain: String,
          weather: String,
          wildlife: String,
        },
      ],
      bodiesOfWater: [
        {
          name: String,
          description: String,
          location: String,
          pictures: [String],
          size: String,
          wildlife: String,
        },
      ],
    },
    characters: [
      {
        name: String,
        abilities: String,
        age: String,
        birthDate: Date,
        birthPlace: String,
        bodyType: String,
        clothes: String,
        characterType: String,
        childhood: String,
        criminalRecord: String,
        development: String,
        dreams: String,
        education: String,
        employment: String,
        eyeColor: String,
        eyesight: String,
        family: [
          {
            bondDescription: String,
            name: String,
            relation: String,
          },
        ],
        fears: String,
        gender: String,
        hairColor: String,
        hairstyle: String,
        handedness: String,
        height: String,
        hobbies: String,
        medicalHistory: String,
        moneyHabits: String,
        motivations: String,
        personality: String,
        pets: String,
        physicalDistinctions: String,
        picture: String,
        relationships: String,
        romanticHistory: String,
        skills: String,
        strengths: String,
        voice: String,
        weaknesses: String,
        weight: String,
      },
    ],
    groups: [
      {
        name: String,
        business: String,
        capital: String,
        connections: String,
        description: String,
        established: Date,
        location: String,
        notableMembers: String,
        pictures: [String],
        size: String,
      },
    ],
    plot: {
      summary: {
        introduction: String,
        development: String,
        obstacles: [String],
        resolution: String,
      },
      arcs: [
        {
          name: String,
          chapters: String,
          protagonists: [
            {
              name: String,
            },
          ],
          antagonists: [
            {
              name: String,
            },
          ],
          tertiary: [
            {
              name: String,
            },
          ],
          foreshadowing: String,
          twists: String,
          picture: String,
          characterDevelopment: String,
          introduction: String,
          development: String,
          obstacles: [String],
          resolution: String,
          subplots: [
            {
              name: String,
              chapters: String,
              introduction: String,
              development: String,
              obstacles: [String],
              resolution: String,
            },
          ],
        },
      ],
    },
    themes: {
      primary: {
        name: String,
        description: String,
        plan: String,
      },
      secondary: [
        {
          name: String,
          description: String,
          plan: String,
        },
      ],
    },
    write: {
      prologue: String,
      epilogue: String,
      chapters: [
        {
          title: String,
          chapterNumber: Number,
          content: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = model('Project', ProjectSchema)

module.exports = ProjectModel