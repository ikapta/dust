// http://www.jstips.co/en/copy-to-clipboard/

/**
 * html
 */
`
<div class="content">
    <h1>Copy to clipboard example</h1>
    <input type="text" id="visible-input" value="JS Tips Rocks!"/>
    <input type="button" id="visible-button" value="Copy">
  </div>
`

/**
 * js
 */

// Copy to clipboard example
document.querySelector("#visible-button").onclick = function() {
  // Select the content
  document.querySelector("#visible-input").select();
  // Copy to the clipboard
  document.execCommand('copy');
};