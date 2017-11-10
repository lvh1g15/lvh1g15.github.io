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
            1: ["email: landonvagohughes@gmail.com", "LinkedIn: linkedin.com/in/landon-vago-hughes-01a47712a"],
            2: ["slider-progress", "search-bar-animation"]

        }

        this.possiblecommands = ['cd: Travel into directory', 'ls: Show contents of directory', 'Help: List commands', 'open: Open content', 'pwd: View your current location']
        this.listofcms = ['cd', 'ls', 'Help', 'open', 'pwd']
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
        let err = new errors(args)
        let links = new HrefLinks()
        console.log(args, this.directoryLevel)

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
                if(this.directorytotal[this.directoryLevel].indexOf(args) == -1){
                    this.instructions.innerHTML += err.cderror
                }else{
                    this.directory += "/contact"
                    this.directoryLevel = 1
                }
            }else if(args == 'projects'){

                this.directory += "/projects"
                this.directoryLevel = 2
            } else {
                this.instructions.innerHTML += err.cderror
            }

        } else if(cmd == "Help") {
            return this.listdirectories(this.possiblecommands)
        } else if(cmd == "open") {
            if(this.directoryLevel == 0){
                this.instructions.innerHTML += err.opendirectoryerr
            }else{

                const requiredlink = links.linkdict[`${args}`]
                links.windowlocation(requiredlink)
                this.instructions.innerHTML += `<p>Check new window for project</p>`
            }
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
                let err = new errors(command)
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
                    this.instructions.innerHTML += err.invalidcmd
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

    constructor(args) {
        this.cderror = ''
        this.invalidcmd = ''
        this.opendirectoryerr = ''
        this.init(args)
    }

    init(args){
        console.log(args)
        this.cderror = `<p>${args} is not an available directory - try open </p>`
        this.invalidcmd = `<p>-bash: ${args}: command not found</p>`
        this.opendirectoryerr = `<p> cannot open directory - try cd</p>`
    }
}

class HrefLinks {
    constructor(){
        this.linkedIn = 'linkedin.com/in/landon-vago-hughes-01a47712a'
        this.searchbaranimation = 'https://github.com/lvh1g15/SearchBar-Animation'
        this.sliderprogress = 'https://cocoapods.org/?q=sliderprogress'
        this.linkdict = {}
        this.init()
    }

    init(){
        this.linkdict = {
            'linkedIn': this.linkedIn,
            'slider-progress': this.sliderprogress,
            'search-bar-animation': this.searchbaranimation
        }
    }

    windowlocation(url) {
        window.open(url, '_blank')
    }
}