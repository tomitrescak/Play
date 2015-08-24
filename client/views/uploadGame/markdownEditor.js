Template.markdownEditor.events({
  "click .preview": function() {
    showMarkdownModal($("#" + this.id).val(), this.label);
  }
})
