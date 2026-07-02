export interface Persona {
  id: string;
  categories: string[];
  basic_information: {
    name: string;
    nickname: string;
    gender: string;
    age: number | string;
    dob: string;
    location: {
      city: string;
      country: string;
    };
    languages: string[];
    occupation: string;
    avatar: string;
  };
  biography: {
    bio_short: string;
    bio_long: string;
    early_life: string;
    career_journey: string;
    current_focus: string;
    achievements: string[];
    experience: {
      company: string;
      role: string;
      duration: string;
      location?: string;
      type?: string;
    }[];
    education: {
      institution: string;
      degree: string;
      field: string;
      start_year: string | number;
      end_year?: string | number;
    }[];
    certifications: {
      name: string;
      issuer: string;
      date: string;
      expiry: string;
    }[];
  };
  personality_and_style: {
    personality_traits: string[];
    tone_of_voice: string;
    traits: string[];
    likes: string[];
    dislikes: string[];
    skills: {
      technical: string[];
      soft: string[];
    };
    values: string[];
    goals: {
      short_term: string[];
      long_term: string[];
    };
    catchphrases: string[];
  };
  digital_presence: {
    social_media: {
      instagram: {
        handle: string;
        comments_samples: string[];
        reply_samples: string[];
      };
      twitter: {
        handle: string;
        comments_samples: string[];
        reply_samples: string[];
      };
      linkedin: {
        handle: string;
        posts: string[];
        comments_samples: string[];
      };
      youtube: {
        channel_name: string;
        link: string;
        subtitles_transcripts: string[];
      };
      hashnode: {
        profile_link: string;
        blogs: {
          title: string;
          link: string;
          description: string;
          type: string;
        }[];
      };
      github: {
        profile_link: string;
        repositories: {
          name: string;
          link: string;
        }[];
      };
    };
    personal_website: string;
    contact: {
      email: string;
      business_contact: string;
    };
  };
  work_and_content: {
    courses: {
      platform: string;
      course_name: string;
      link: string;
    }[];
    projects: {
      name: string;
      description: string;
      link: string;
    }[];
    books_or_publications: {
      title: string;
      year: string;
      link: string;
    }[];
    events_or_talks: {
      event_name: string;
      date: string;
      topic: string;
    }[];
  };
  media: {
    photos: string[];
    videos: string[];
    voice_samples: string[];
  };
  interactions: {
    comments: string[];
    quotes: string[];
    faq: string[];
    fan_questions: string[];
  };
  knowledge_base: {
    topics_of_expertise: string[];
    opinions: string[];
    tutorials: string[];
    transcripts: string[];
  };
  ai_persona_behavior: {
    response_style: string;
    do_not_respond_topics: string[];
    preferred_length: string;
    roleplay_mode: boolean;
  };
}

export type PersonalityTone = "default" | "funny" | "advice" | "educational";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai" | "system" | "assistant" | "devloper";
  timestamp: Date;
  personaId?: string;
  imageUrl?: string;
  reaction?: "like" | "dislike" | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  personas: string[];
}
