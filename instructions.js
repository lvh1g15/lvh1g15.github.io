class Instructions {

    constructor(instructions) {

        let inputcommand = document.getElementById('inputcommands')
        inputcommand.focus()
        this.instructions = instructions
        this.commandKeys = {
            enter: 13,
        };
        this.command = {}
        this.directory = "/home"
        this.possiblepaths = ['projects', 'contact']

        this.contact = ["email: landonvagohughes@gmail.com", "github: lvh1g15", "linkedIn: linkedin.com/in/landon-vago-hughes-01a47712a"]
        this.projects = ["https://cocoapods.org/?q=sliderprogress", "https://github.com/lvh1g15/SearchBar-Animation"]
        Instructions.init()
        this.setListeners(instructions);

        this.nakedcommands =
            "<span class='helper'>Type 'Help' to see all available functions you are able to use</span>\n" +
            "<p id='wrapper'>\n" +
                "<span>\n" +
                    "<span class='roottick'> root ❯ </span>\n" +
                "</span>\n" +
                "<span contenteditable='true' id='inputcommands'></span>\n" +
            "</p>"
    }

    static pwd() {
        return this.directory
    }

    static init(){
        $(body).css('background-color', 'black')
    }

    handlecommand(cmd, args) {
        if(cmd == 'pwd')
        return this.directory
    }

    setListeners(instructions) {
        instructions.addEventListener("keypress", (event) => {
            let key = event.keyCode;
            if (key === this.commandKeys.enter) {
                let target = event.target
                let input = target.textContent.trim().split(" ");
                let command = input[0];
                let args = input[1];

                console.log(command, args)

                if(command == 'clear') {
                    this.clearhistory()
                } else if(command && ['pwd', 'ls', 'open', 'cd'].includes(command)) {
                    this.instructions.innerHTML += this.handlecommand(command, args)
                    this.reset(target)
                } else {
                    this.instructions.innerHTML += "<p style='padding-left:  10px; font-family: Menlo; font-size: 15px; color: lime'>Error: command not recognized</p>";
                    this.reset(target);
                }

                if(command.value == "Help"){
                    alert("You have proceeded to help");
                }
                event.preventDefault()
            }
        });
    }

    clearhistory(){
        this.instructions.innerHTML = this.nakedcommands;
        let input = document.getElementById('inputcommands')
        input.focus();
    }

    reset(previoustarget) {
        var copy = event.target.parentNode.cloneNode(true);
        previoustarget.setAttribute('contenteditable', false);
        var divbyID = document.getElementById("instructions");
        divbyID.append(copy);
        copy.querySelector('#inputcommands').innerHTML = '';
        copy.querySelector('#inputcommands').focus();
    }
}