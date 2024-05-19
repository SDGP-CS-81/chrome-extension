export class State {
  static originalSrcUrl: string;
  static audioSrcUrl: string;
  static audioModeListener: (message: { [key: string]: string }) => void;
}
