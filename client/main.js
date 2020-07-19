import {Template} from "meteor/templating"
import {Mongo} from "meteor/mongo"
import {Session} from "meteor/session"

import "./main.html"

const Documents = new Mongo.Collection("documents")

Template.body.helpers({
    documents() {
        return Documents.find({}, {sort: {name: 1}})
    },
    currentContent() {
        const a = Session.get("active")
        const d = Documents.findOne({_id: a})
        if (d) {
            return d.content
        } else {
            return ""
        }
    },
})

Template.document.helpers({
    isCurrent() {
        return this._id == Session.get("active")
    },
})

Template.body.events({
    "click #add-button"(event) {
        var name = prompt("Please enter a name for the new document:")
        const id = Documents.insert({name: name, content: ""})
        Session.set("active", id)
    },
    "click .delete-button"(event) {
        Documents.remove(this._id)
        Session.set("active", null)
    },
    "click .doc-button"(event) {
        Session.set("active", this._id)
    },
    "keyup #content"(event) {
        const a = Session.get("active")
        if (a) {
            Documents.update(a, {
                $set: {content: event.target.value},
            })
        }
    },
})
