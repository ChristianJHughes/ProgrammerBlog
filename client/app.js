var $ = require('jquery'),
    autocomplete = require('./autocomplete');

$(function(){

  // On each individuL blog page.
  var commentSubmitButton = $('#commentButton');
  var commentTextArea = $('#commentText');
  var comments = $('#commentDiv');

  // On the new blog form page.
  var inlineCodeButton = $('#addInlineCodeButton');
  var inlineCodeTextArea = $('#createInlineCode');
  var blogPostContentEditor = $('#postContent');
  var codeStyleSelect = $('#codeStyle');
  var programmingLangSelect = $('#programmingLangSelect');


  inlineCodeButton.on('click', function() {
    if (codeStyleSelect.val() == "CodeBlock")
    {
      // Make it a code block.
      console.log("Here!");
      blogPostContentEditor.val(blogPostContentEditor.val() + "\n<br />" +
      "<pre><code class='language-" + programmingLangSelect.val() + "'>" + inlineCodeTextArea.val() +
      "</code></pre><br />\n");
    }
    else
    {
      console.log("ElseHere!");
      // Make it inline.
      blogPostContentEditor.val(blogPostContentEditor.val() + "<code class='language-" + programmingLangSelect.val() + "'>" + inlineCodeTextArea.val() +
      "</code>");
    }

  });

  var pageID = window.location.pathname.split( '/' );
  pageID = pageID[pageID.length - 1];

  commentSubmitButton.on('click', function() {
    $.post("/blog/addComment/" + pageID,
          commentTextArea.val(),
           function(commentID) {
             comments.append(
               "<textarea rows='3' style='resize: none;' readonly='true'>" +
                 commentTextArea.val() +
               "</textarea>" +
               "<a class='bttn' href='/blog/" + commentID + "/deleteComment'><strong>[DELETE]</strong></a>" +
               "<br />"
             );
             commentTextArea.val("")
           });
  });

});
