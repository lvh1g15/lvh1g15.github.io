class Themechange {

    constructor(changetheme){
        this.command = {}
        this.changetheme = changetheme
        this.setlistener(this.changetheme)
    }

    handler(content){
        console.log(content)
        switch (content) {
            case "Grass":
                $(body).css('background-color', 'green');
                break;
            case 'Homebrew':
                $(body).css('background-color', 'black');
                break
        }
    }

    setlistener(button){
        button.addEventListener("click", (event) => {
            const content = event.target.textContent
            return this.handler(content)
        })
    }
}