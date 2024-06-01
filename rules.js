class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Start");
        this.engine.hideKeycard();
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation, true);
    }
}

class Location extends Scene {
    create(key, showBody) {
        let locationData = this.engine.storyData.Locations[key];
        if (showBody) { // Only show the body text if showBody is true
            this.engine.show(locationData.Body);
        }

        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                // Mechanisms will not show up when you possess keycard
                if (!(choice.Mechanism && this.engine.keys.includes("Keycard"))){
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The End");
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            if(choice.Mechanism) {
                this.engine.gotoScene(Mechanism, choice);
            } else if(choice.RequiredKey) { // If a key is required
                if(this.engine.keys.includes(choice.RequiredKey)) { // If that key has been obtained
                    this.engine.gotoScene(Location, choice.Target, true);
                } else {
                    this.engine.show(choice.NoKeyText);
                    this.engine.gotoScene(Location, choice.NoKeyTarget)
                }
            } else { // No required key
                this.engine.gotoScene(Location, choice.Target, true);
            }
            // If this choice awards a key
            if(choice.AwardsKey) {
                this.engine.awardKey(choice.AwardsKey); // Award the key
                if (choice.Mechanism) {
                    this.engine.show("I found it!");
                }
            } else if (choice.Mechanism) { // If a mechanism doesn't award a key
                // Show random not found phrase
                let phrases = this.engine.storyData.NotFoundPhrases;
                let phraseKeys = Object.keys(phrases);
                let phrase = phraseKeys[Math.floor(Math.random() * phraseKeys.length)];
                let phraseText = phrases[phrase];
                this.engine.show(phraseText);
                // Give a hint for appropriate area
                let hints = this.engine.storyData.Hints[this.engine.keycardArea];
                let hintKeys = Object.keys(hints);
                let hint = hintKeys[Math.floor(Math.random() * hintKeys.length)];
                let hintText = hints[hint];
                this.engine.show(hintText);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class Mechanism extends Location {
    create(key) {
        let mechanism = key.Mechanism;
        this.engine.show(mechanism.Text);
        this.engine.addChoice("Continue", key);
    }

    handleChoice(choice) {
        this.engine.gotoScene(Location, choice.Target);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');