class Instructions {

    constructor(instructions) {

        let inputcommand = document.getElementById('inputcommands')
        inputcommand.focus()
        this.instructions = instructions
        this.commandKeys = {
            enter: 13,
        };
        this.directory = "/home"
        this.directoryLevel = 0
        this.possiblepaths = ['projects', 'contact']

        this.directorytotal = {

            0: ['projects', 'contact'],
            1: ["email: landonvagohughes@gmail.com", "github: lvh1g15", "linkedIn: linkedin.com/in/landon-vago-hughes-01a47712a"],
            2: ["https://cocoapods.org/?q=sliderprogress", "https://github.com/lvh1g15/SearchBar-Animation"]

        }

        this.possiblecommands = ['cd: Travel into directory', 'ls: Show contents of directory', 'Help: List commands', 'open: Open content', 'pwd: View your current location']
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

        if(cmd == 'pwd'){
            return this.directory
        } else if(cmd == "ls"){

            if(this.directoryLevel == 0) {
                return this.listdirectories(this.directorytotal[0])
            }else if(this.directoryLevel == 1) {
                return this.listdirectories(this.directorytotal[1])
            }else if(this.directoryLevel == 2) {
                return this.listdirectories(this.directorytotal[2])
            }

        } else if(cmd == "cd"){
            if(args == "contact"){

                if(this.directorytotal != 1){

                }

                this.directory += "/contact"
                this.directoryLevel = 1
            }else if(args == 'projects'){
                this.directory += "/projects"
                this.directoryLevel = 2
            }
        } else if(cmd == "Help"){
            return this.listdirectories(this.possiblecommands)
        }
    }

    listdirectories(list){
        let output = ""
        list.forEach((item)=>{
            output += `<p>${item}</p>`
        });
        console.log(output)
        return output
    }

    setListeners(instructions) {
        instructions.addEventListener("keypress", (event) => {
            let key = event.keyCode;
            if (key === this.commandKeys.enter) {
                let target = event.target
                let input = target.textContent.trim().split(" ");
                let command = input[0];
                let args = input[1];

                if(command == 'clear') {
                    this.clearhistory()
                } else if(command && ['pwd', 'ls', 'open', 'cd', 'Help'].includes(command)) {
                    if(command === 'cd'){
                        this.handlecommand(command, args)
                    }else{
                        this.instructions.innerHTML += this.handlecommand(command, args)
                    }
                    this.reset(target)
                } else {
                    this.instructions.innerHTML += "<p style='padding-left:  10px; font-family: Menlo; font-size: 15px; color: lime'>Error: command not recognized</p>";
                    this.reset(target);
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



class errors {

    constructor() {
        this.cderror = ''
        this.invalidcmd = ''
        this.init()
    }

    init(){

    }

    
}