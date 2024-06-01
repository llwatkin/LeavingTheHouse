class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass);
            }
        );

        this.keys = []; // Initialize empty array of keys
    }

    hideKeycard() {
        // Set random location and area for key card
        // Choose random area
        const areaKeys = Object.keys(this.storyData.KeycardAreas);
        const areaIndex = Math.floor(Math.random() * areaKeys.length);
        const randArea = areaKeys[areaIndex];
        const locations = this.storyData.KeycardAreas[randArea];
        // Choose random location from that area
        const locationKeys = Object.keys(locations);
        const locationIndex = Math.floor(Math.random() * areaKeys.length);
        const randLocation = locationKeys[locationIndex];
        const location = locations[randLocation];
        
        this.keycardArea = randArea;
        
        console.log("The keycard is located on a " + randArea + " in the " + location + ".");
        // Enable "AwardsKey" for this location
        const choiceKeys = Object.keys(this.storyData.Locations[location].Choices);
        const choice = this.storyData.Locations[location].Choices[choiceKeys[areaIndex]];
        choice.AwardsKey = "Keycard";
    }

    gotoScene(sceneClass, data, showBody) {
        this.scene = new sceneClass(this);
        this.scene.create(data, showBody);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleChoice(data);
        }
    }

    awardKey(key) {
        this.keys.push(key); // Add key to array of keys
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}