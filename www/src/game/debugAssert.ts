/**
 * Simple assertion function that checks a condition and reports an error if it fails.
 * 
 * @param {boolean} assertionPassed - The condition to assert; should be true for normal execution.
 * @param {string} message - The message to display if the assertion fails.
 * 
 * @remarks
 * Currently, this function reports assertion failures by showing a browser alert.
 * A less invasive reporting mechanism could be implemented in the future.
 */
export function assert(assertionPassed: boolean, message: string) {
    // TODO: Less invasive reporting than an alert
    if (!assertionPassed) {
        alert(`Assertion failed: ${message}`);
    }
}
