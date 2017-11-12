class Themechange {

    constructor(changetheme){
        this.command = {}
        this.changetheme = changetheme
        this.setlistener(this.changetheme)
    }

    handler(content){
        switch (content) {
            case "Grass":
                $(body).css('background-color', 'green');
                $(instructions).css('color', 'black')
                break;
            case 'Homebrew':
                $(body).css('background-color', 'black');
                $(instructions).css('color', 'lime')
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