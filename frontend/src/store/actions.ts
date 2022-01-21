export const SELECT_THEME = "SELECT_THEME";
export const selectTheme = (themeName: string) => ({
    type: SELECT_THEME,
    payload: themeName
});

export const ADD_LOG = "ADD_LOG";
/**
 *
 * @param {Object} log - Log to add to current list
 * @param {string} log.origin - Program that threw the log, examples: "SkyPasta", "ACOM"
 * @param {string} log.content - Log content
 * @param {string} log.type - Oneof: "info", "success", "warning", "error"
 * @param {string} log.time - Timestamp of log creation
 * @returns
 */
// export const addLog = (log) => ({
//     type: ADD_LOG,
//     payload: { ...log, time: new Date().toLocaleTimeString() }
// });