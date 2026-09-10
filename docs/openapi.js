const openapiSpecification = {
    openapi: "3.0.0",

    info: {
        title: "Personal Digital Timeline API",
        version: "1.0.0",
        description: "API for managing a personal digital timeline"
    },

    servers: [
        {
            url: "http://localhost:3000"
        }
    ],

    components: {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        }
    },

    schemas: {
        TimelineEntry: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    example: 1
                },
                title: {
                    type: "string",
                    example: "Learn PostgreSQL"
                },
                description: {
                    type: "string",
                    example: "Learned about indexes and query optimization."
                },
                type: {
                    type: "string",
                    enum: [
                        "project",
                        "learning",
                        "milestone",
                        "achievement",
                        "goal"
                    ],
                    example: "learning"
                },
                created_at: {
                    type: "string",
                    format: "date-time",
                    example: "2026-09-11T03:30:00Z"
                },
                user_id: {
                    type: "integer",
                    example: 1
                }
            }
        }
    },
    
        
},

TimelineList: {
    type: "object",
    properties: {
        data: {
            type: "array",
            items: {
                $ref: "#/components/schemas/TimelineEntry"
            }
        },
        pagination: {
            type: "object",
            properties: {
                page: {
                    type: "integer",
                    example: 1
                },
                limit: {
                    type: "integer",
                    example: 10
                },
                total: {
                    type: "integer",
                    example: 25
                },
                totalPages: {
                    type: "integer",
                    example: 3
                }
            }
        }
    }
},

AuthUser: {
    type: "object",
    properties: {
        id: {
            type: "integer",
            example: 1
        },
        email: {
            type: "string",
            example: "user@example.com"
        },
        created_at: {
            type: "string",
            format: "date-time",
            example: "2026-09-11T03:30:00Z"
        }
    }
},

    paths: {
        "/": {
            get: {
                summary: "Check API status",
                description: "Returns a message confirming that the API is running.",
                responses: {
                    200: {
                        description: "API is running"
                    }
                }
            }
        },

        "/api/auth/register": {
            post: {
                summary: "Register a new user",
                description: "Creates a new user account.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: {
                                        type: "string",
                                        example: "user@example.com"
                                    },
                                    password: {
                                        type: "string",
                                        example: "mySecurePassword123"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                  201: {
    description: "User registered successfully",
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/AuthUser"
            }
        }
    }
},
                    400: {
                        description: "Email or password is missing"
                    },
                    409: {
                        description: "Email already registered"
                    }
                }
            }
        },

        "/api/auth/login": {
            post: {
                summary: "Log in a user",
                description: "Authenticates a user and returns a JWT.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: {
                                        type: "string",
                                        example: "user@example.com"
                                    },
                                    password: {
                                        type: "string",
                                        example: "mySecurePassword123"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                   200: {
    description: "Login successful",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Login successful"
                    },
                    token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                }
            }
        }
    }
},
                    400: {
                        description: "Email or password is missing"
                    },
                    401: {
                        description: "Invalid email or password"
                    }
                }
            }
        },

        "/api/auth/me": {
            get: {
                summary: "Get authenticated user",
                description: "Returns the information stored in the authenticated user's JWT.",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Authenticated user information retrieved successfully"
                    },
                    401: {
                        description: "Authentication required or token is invalid"
                    }
                }
            }
        },

        "/api/timeline": {
            get: {
                summary: "Get timeline entries",
                description: "Returns the authenticated user's timeline entries.",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 1,
                            default: 1
                        },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 1,
                            maximum: 50,
                            default: 10
                        },
                        description: "Number of entries per page"
                    },
                    {
                        name: "type",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            enum: [
                                "project",
                                "learning",
                                "milestone",
                                "achievement",
                                "goal"
                            ]
                        },
                        description: "Filter entries by type"
                    },
                    {
                        name: "sort",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["newest", "oldest"],
                            default: "newest"
                        },
                        description: "Sort entries by creation date"
                    }
                ],

                responses: {
                  200: {
    description: "Timeline entries retrieved successfully",
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/TimelineList"
            }
        }
    }
},
                    401: {
                        description: "Authentication required or token is invalid"
                    }
                }
            },

            post: {
                summary: "Create a timeline entry",
                description: "Creates a new timeline entry for the authenticated user.",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "description", "type"],
                                properties: {
                                    title: {
                                        type: "string",
                                        example: "Learn PostgreSQL"
                                    },
                                    description: {
                                        type: "string",
                                        example: "Learned about indexes and query optimization."
                                    },
                                    type: {
                                        type: "string",
                                        enum: [
                                            "project",
                                            "learning",
                                            "milestone",
                                            "achievement",
                                            "goal"
                                        ],
                                        example: "learning"
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                   201: {
    description: "Timeline entry created successfully",
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/TimelineEntry"
            }
        }
    }
},
                    400: {
                        description: "Invalid timeline entry data"
                    },
                    401: {
                        description: "Authentication required or token is invalid"
                    }
                }
            }
        },

        "/api/timeline/{id}": {
            get: {
                summary: "Get a timeline entry by ID",
                description: "Returns a specific timeline entry belonging to the authenticated user.",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer",
                            minimum: 1
                        },
                        description: "ID of the timeline entry"
                    }
                ],

                responses: {
                   200: {
    description: "Timeline entry retrieved successfully",
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/TimelineEntry"
            }
        }
    }
},
                    400: {
                        description: "ID must be a valid number"
                    },
                    401: {
                        description: "Authentication required or token is invalid"
                    },
                    404: {
                        description: "Timeline entry not found"
                    }
                }
            },

            put: {
                summary: "Update a timeline entry",
                description: "Updates a timeline entry belonging to the authenticated user.",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer",
                            minimum: 1
                        },
                        description: "ID of the timeline entry"
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "description", "type"],
                                properties: {
                                    title: {
                                        type: "string",
                                        example: "Learn Advanced PostgreSQL"
                                    },
                                    description: {
                                        type: "string",
                                        example: "Studied query optimization and indexing."
                                    },
                                    type: {
                                        type: "string",
                                        enum: [
                                            "project",
                                            "learning",
                                            "milestone",
                                            "achievement",
                                            "goal"
                                        ],
                                        example: "learning"
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
    description: "Timeline entry updated successfully",
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/TimelineEntry"
            }
        }
    }
},
                    400: {
                        description: "Invalid timeline data or ID"
                    },
                    401: {
                        description: "Authentication required or token is invalid"
                    },
                    404: {
                        description: "Timeline entry not found"
                    }
                }
            },

            delete: {
                summary: "Delete a timeline entry",
                description: "Deletes a timeline entry belonging to the authenticated user.",

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer",
                            minimum: 1
                        },
                        description: "ID of the timeline entry"
                    }
                ],

                res200: {
    description: "Timeline entry deleted successfully",
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/TimelineEntry"
            }
        }
    }
},
                    400: {
                        description: "ID must be a valid number"
                    },
                    401: {
                        description: "Authentication required or token is invalid"
                    },
                    404: {
                        description: "Timeline entry not found"
                    }
                }
            }
        }
    };

module.exports = openapiSpecification;