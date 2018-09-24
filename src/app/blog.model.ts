export interface Post {
  id: null;
  title: string;
  content: string;
  email: string;
  image: any;
  comments: any;
}

export interface Comment {
  id: null;
  comEmail: string;
  text: string;
  postId: string;
  rating: number;
}

