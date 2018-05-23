it("should create a Player from a JSON", function () {
    const playerS = {
        "$schema": "http://json-schema.org/schema#",
        "id": "http://wizar-continuum.com/schema/model/player.json",
        "properties": {
            "entity": {
                "constant": "ENTITY"
            },
            "location": {
                "constant": "GEO_LOCATION"
            }
        }
    };


    // entity.json
    const entityS = {
        "$schema": "http://json-schema.org/schema#",
        "id": "http://wizar-continuum.com/schema/component/entity.json",
        "type": "object",
        "properties": {
            "props": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "aura": {
                        "type": "number"
                    },
                    "phase": {
                        "type": "number"
                    }
                }
            },
            "mutations": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "mutators": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "controlStates": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "representations": {
                "type": "object"
            }
        }
    };

    // geolocation.json
    const geolocationS = {
        "$schema": "",
        "id": "",
        "type": "object",
        "properties": {
            "geojson": "http://json-schema.org/geojson/geojson.json#"
        }
    };

    // inventory.json
    const inventoryS = {
        $schema: "http://json-schema.org/schema#",
        id: "http://wizar-continuum.com/schemas/inventory.json",
        definitions: {
            slot: {
                properties: {
                    prefabId: {
                        type: "string"
                    },
                    quantity: {
                        type: "number"
                    }
                },
                required: [
                    "prefabId",
                    "quantity"
                ]
            }
        },
        properties: {
            slots: {
                maxSize: {
                    type: "number"
                },
                type: "array",
                items: {
                    $ref: "#/definitions/slot"
                }
            }
        },
        "required": ["slots"]
    };
});