class Instructions {
    constructor(instructions) {
        let inputcommand = document.getElementById('inputcommands')
        inputcommand.focus()
        Instructions.init()
        this.instructions = instructions
        this.commandKeys = {
            enter: 13,
        };
        this.setListeners(instructions);
        this.nakedcommands =
            "<span class='helper'>Type 'Help' to see all available functions you are able to use</span>\n" +
            "<div>\n" +
                "<span class='single' id='single'>\n" +
                    "<span>\n" +
                        "<span class='roottick'> root ❯ </span>\n" +
                    "</span>\n" +
                    "<span contenteditable='true' id='inputcommands'></span>\n" +
                "</span>\n" +
            "</div>"
    }

    static init(){
        $(body).css('background-color', 'black')
    }

    setListeners(instructions) {
        instructions.addEventListener("keypress", (event) => {
            let key = event.keyCode;
            if (key === this.commandKeys.enter) {
                let target = event.target
                let input = target.textContent.trim().split(" ");
                let command = input[0];

                if(command == 'clear') {
                    this.clearhistory()
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