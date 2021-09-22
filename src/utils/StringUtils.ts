/**
 * Utils to work with strings.
 */
export class StringUtils {
    /**
     * Lik trim but not only for white spaces.
     * @param word Word to cut off.
     * @param char String that should be removed from the end of the word.
     */
    public static trimChar(word: string, char: string): string {
        if (word.endsWith(char)) {
            return word.substring(0, word.lastIndexOf(char));
        }
        return word;
    }
}
