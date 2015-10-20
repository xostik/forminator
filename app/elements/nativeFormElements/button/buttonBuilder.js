function ButtonBuilder(buttonConstructor) {
    if(buttonConstructor) this.ButtonConstructor = buttonConstructor;
    else this.ButtonConstructor = Button;

    this.build = function (builder, parent, metadata) {
        var button = new this.ButtonConstructor(parent);
        button.setText(metadata.Text);
        button.setVisible(metadata.Visible);

        button.setHorizontalAlignment(metadata.HorizontalAlignment);

        if(metadata.Action) {
            button.setAction(builder.build(parent, metadata.Action));
        }

        if (parent && metadata.OnClick){
            button.onClick(function() {
                new ScriptExecutor(parent).executeScript(metadata.OnClick.Name);
            });
        }
        return button;
    };
}
