export type GitHubOptionsType = { repoOwner: string; repoName: string; filePath: string; githubPat: string; branch: string };
export type FigmaOptionsType = { pat: string };
export type InspectorOptionsType = {
  /**
   * Show figma styles in the inspector
   */
  showStyles: boolean;
  /**
   * Show figma styles only when tokens are missing
   */
  mergeWithTokens: boolean;
}
