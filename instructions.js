class Instructions {

    constructor(instructions) {
        this.manager = new commandsnode()
        let inputcommand = document.getElementById('inputcommands')
        inputcommand.focus()
        this.instructions = instructions
        this.commandKeys = {
            enter: 13,
        };

        this.setListeners(instructions);

        this.nakedcommands =
            "<p>Current time: <span id='datetime'>Tue Nov 7 03:27:48</span></p>\n" +
            "<span class='helper'>Welcome user to Landons' terminal - Type 'help' to get started</span>\n" +
            "<p id='wrapper'>\n" +
                "<span>\n" +
                    "<span class='roottick'> root ❯ </span>\n" +
                "</span>\n" +
                "<span contenteditable='true' id='inputcommands'></span>\n" +
            "</p>"
        Instructions.updateDateTime()
    }

    static pwd() {
        return this.directory
    }

    static updateDateTime() {
        let date = new Date();
        let d = document.getElementById("datetime");
        d.innerHTML = date;
    }

    listdirectories(list){
        let output = ""
        list.forEach((item)=>{
            output += `<p>${item}</p>`
        });
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
                } else if(command && ['pwd', 'ls', 'open', 'cd', 'help'].includes(command)) {
                    if(command === 'cd'){
                        console.log(args)
                        this.manager.handlecommands(command, args, this.instructions)
                    }else{
                        console.log(command)
                        this.instructions.innerHTML += this.manager.handlecommands(command, args, this.instructions)
                    }
                    this.reset(target)
                }else {
                    this.instructions.innerHTML += this.manager.errors(command, 1)
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
        Instructions.updateDateTime()
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

class HrefLinks {
    constructor(){
        this.linkedIn = 'https://linkedin.com/in/landon-vago-hughes-01a47712a'
        this.searchbaranimation = 'https://github.com/lvh1g15/SearchBar-Animation'
        this.sliderprogress = 'https://cocoapods.org/?q=sliderprogress'
        this.tinderanimation = 'https://github.com/lvh1g15/TinderLikeAnimation'
        this.raspberrypiiot = 'https://github.com/hackcity2017'
        this.govhack = 'https://github.com/GovHackBackstreets'
        this.linkdict = {}
        this.init()
    }

    init(){
        this.linkdict = {
            'linkedIn': this.linkedIn,
            'slider-progress': this.sliderprogress,
            'search-bar-animation': this.searchbaranimation,
            'tinder-inspired': this.tinderanimation,
            'raspberry-pi-iOS': this.raspberrypiiot,
            'foodstamp-iOS': this.govhack
        }
    }

    windowlocation(url) {
        window.open(url, '_blank')
    }
}

class commandsnode {
    constructor() {
        this.links = new HrefLinks()
        this.parent = ''
        this.command = {}
        this.directory = "/home"
        this.directoryLevel = 0
        this.directorytotal = {

            0: ['projects', 'contact'],
            1: ["email: landonvagohughes3@gmail.com", "linkedIn"],
            2: ["slider-progress", "search-bar-animation", 'tinder-inspired', 'raspberry-pi-iOS', 'foodstamp-iOS']

        }

        this.path = {
            0: "/home",
            1: "/home/contact",
            2: "/home/projects"
        }

        this.help = ['cd: travel into directory e.g cd projects',
                        'ls: show contents of directory',
                        'Help: list commands',
                        'open: open content e.g open ->projectname<-',
                        'pwd: view your current location',
                        "clear: clear command history",
                        'cd .. :going back one directory'
                    ]
        this.init()
    }

    init(){
        this.command.pwd = () => {
            return this.path[this.directoryLevel]
        }

        this.command.open = (args) => {
            if(this.directorylevel == 0){
                this.parent.innerHTML += this.errors(args, 2)
            }else {

                const requiredlink = this.links.linkdict[`${args}`]
                this.links.windowlocation(requiredlink)
                return `<p>${args} has opened in another tag please have a look</p>`
            }
        }

        this.command.cd = (args) => {
            console.log(args)
            if(args == ".."){
                if(this.directoryLevel == 0){
                    this.parent.innerHTML += this.errors(args, 3)
                }else {
                    this.directoryLevel = 0
                }
            }else{
                if(this.directorytotal[this.directoryLevel].indexOf(args) == -1){
                    this.parent.innerHTML += this.errors(args, 0)
                }else{
                    this.directory += `/${args}`
                    if(args == 'projects'){
                        this.directoryLevel = 2
                    }else if(args == 'contact'){
                        this.directoryLevel = 1
                    }
                }
            }
        }

        this.command.help = () => {
            return this.listdirectories(this.help)
        }

        this.command.ls = () => {
            return this.listdirectories(this.directorytotal[this.directoryLevel])
        }
    }

    errors(args, errcode){
        const dictoferror = {
            0: this.cderror = `<p>${args} is not an available directory - try open </p>`,
            1: this.invalidcmd = `<p>-bash: ${args}: command not found</p>`,
            2: this.opendirectoryerr = `<p> cannot open directory - try cd</p>`,
            3: this.homealready = `<p> You are already in home directory </p>`
        }
        return dictoferror[errcode]
    }

    listdirectories(list){
        let output = ""
        list.forEach((item)=>{
            output += `<p>${item}</p>`
        });
        return output
    }

    handlecommands(cmd, args, parent){
        console.log(cmd)
        this.parent = parent
        return this.command[cmd](args)
    }
}