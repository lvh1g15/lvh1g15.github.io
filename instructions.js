class Instructions {

    constructor(instructions) {
        this.manager = new commandsnode()
        let inputcommand = document.getElementById('inputcommands')
        this.date = new Date();
        inputcommand.focus()
        this.instructions = instructions
        this.commandKeys = {
            enter: 13,
        };
        this.nakedcommands = `<p>Current Time: ${this.date.toString()}</p>` +
        "<p>Welcome user to Landons' terminal - Type 'help' to get started </p>" +
        "<p>Here is an example to get started: cd projects</p>"

        this.setListeners(instructions);

        this.updateIntroText()
    }

    static pwd() {
        return this.directory
    }

    updateIntroText() {
        let d = document.getElementById("intro");
        d.innerHTML = this.nakedcommands;
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
        this.linkdict = {};
        this.linkdictKeys = Object.keys(this.linkdict);
        this.init()
    }

    init(){
        this.linkdict = {
            'YSplit': {'link': 'https://ysplit.com', 'level': 2},
            'First Time Founder - Substack': {'link': 'https://firsttimefounder.substack.com/', 'level':2},
            'linkedIn': {'link': 'https://linkedin.com/in/landon-vago-hughes-01a47712a', 'level': 1},
            'slider-progress': {'link': 'https://cocoapods.org/?q=sliderprogress', 'level': 2},
            'search-bar-animation': {'link': 'https://github.com/lvh1g15/SearchBar-Animation', 'level': 2},
            'tinder-inspired': {'link': 'https://github.com/lvh1g15/TinderLikeAnimation', 'level': 2},
            'foodstamp-iOS': {'link': 'https://github.com/GovHackBackstreets', 'level': 2},
            'email': {'link': 'mailto:landonvagohughes3@gmail.com', 'level': 1},
            'double-pendulum': {'link': 'https://lvh1g15.github.io/pendulum', 'level': 2}}
        }

    checkLevel() {
        return this.link
    }

    windowlocation(url) {
        if(url){
            console.log(url);
            window.location.href = url;
        }else{
            window.open(url, '_blank')
        }
    }
}

class commandsnode {
    constructor() {
        this.links = new HrefLinks();
        this.parent = '';
        this.command = {};
        this.directory = "/home";
        this.directoryLevel = 0;
        this.directorytotal = {

            0: ['Projects', 'Contact'],
            1: ['linkedIn', 'email'],
            2: ["YSplit", "First Time Founder - Substack", "slider-progress", "search-bar-animation", 'tinder-inspired', 'raspberry-pi-iOS', 'foodstamp-iOS', 'double-pendulum']

        };

        this.path = {
            0: "/home",
            1: "/home/contact",
            2: "/home/projects"
        };

        this.help = ['cd: travel into directory e.g cd projects',
                        'ls: show contents of directory',
                        'Help: list commands',
                        'open: open content e.g open ->projectname<-',
                        'pwd: view your current location',
                        "clear: clear command history",
                        'cd .. :going back one directory'
                    ];
        this.init()
    }

    init(){
        this.command.pwd = () => {
            return this.path[this.directoryLevel]
        };

        this.command.open = (args) => {
            if(this.directorylevel == 0){
                this.parent.innerHTML += this.errors(args, 2)
            }else {
                const requiredlink = this.links.linkdict[`${args}`]['link'];
                this.links.windowlocation(requiredlink);
                return `<p>${args} has opened in another tag please have a look</p>`
            }
        };

        this.command.cd = (args) => {
            console.log(args);
            if(args == ".."){
                console.log(this.directoryLevel);
                if(this.directoryLevel == 0){
                    this.parent.innerHTML += this.errors(args, 3)
                }else {
                    this.directoryLevel = 0
                }
            }else{
                if(this.directorytotal[this.directoryLevel].indexOf(args) == -1){
                    this.parent.innerHTML += this.errors(args, 0)
                }else{
                    this.directory += `/${args}`;
                    if(args == 'Projects'){
                        this.directoryLevel = 2
                    }else if(args == 'Contact'){
                        this.directoryLevel = 1
                    }
                }
            }
        };

        this.command.help = () => {
            return this.listdirectories(this.help)
        };

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
        };
        return dictoferror[errcode]
    }

    listdirectories(list){
        let output = "";
        list.forEach((item)=>{
            output += `<p>${item}</p>`
        });
        return output
    }

    handlecommands(cmd, args, parent){
        console.log(cmd);
        this.parent = parent;
        return this.command[cmd](args)
    }
}