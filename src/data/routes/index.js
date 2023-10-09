export const pageRoutes={
    "code": 200,
    "msg": "操作成功",
    "type": 0,
    "data": [
        {
            "path": "/",
            "hidden": false,
            "component": "Layout",
            "children": [
                {
                    "name": "Home",
                    "path": "home",
                    "hidden": false,
                    "component": "index",
                    "meta": {
                        "title": "首页",
                        "englishName": "",
                        "icon": "energy-dn-kanban",
                        "noCache": false,
                        "link": null
                    },
                    "platformId": 1
                }
            ],
            "platformId": 1
        },
        {
            "name": "Project",
            "path": "/project",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
                "title": "项目DEMO",
                "englishName": "",
                "icon": "energy-dn-houtai",
                "noCache": false,
                "link": null
            },
            "children": [
                {
                    "name": "Yunboo",
                    "path": "yunboo",
                    "hidden": false,
                    "redirect": "noRedirect",
                    "component": "ParentView",
                    "alwaysShow": true,
                    "meta": {
                        "title": "鼋博",
                        "englishName": null,
                        "icon": "",
                        "noCache": false,
                        "link": null
                    },
                    "children": [
                        {
                            "name": "MindMap",
                            "path": "mindMap",
                            "hidden": false,
                            "component": "project/yunboo/mindMap/index",
                            "meta": {
                                "title": "脑图",
                                "englishName": null,
                                "icon": "",
                                "noCache": false,
                                "link": null
                            },
                            "platformId": 1
                        }
                    ],
                    "platformId": 1
                },
            ],
            "platformId": 1
        },
        {
            "name": "Technology",
            "path": "/technology",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
                "title": "技术栈",
                "englishName": "",
                "icon": "energy-dn-houtai",
                "noCache": false,
                "link": null
            },
            "children": [
                {
                    "name": "HTML",
                    "path": "HTML",
                    "hidden": false,
                    "redirect": "noRedirect",
                    "component": "ParentView",
                    "alwaysShow": true,
                    "meta": {
                        "title": "HTML",
                        "englishName": null,
                        "icon": "",
                        "noCache": false,
                        "link": null
                    },
                    "children": [
                        {
                            "name": "VNode",
                            "path": "VNode",
                            "hidden": false,
                            "component": "technology/HTML/VNode/index",
                            "meta": {
                                "title": "虚拟节点",
                                "englishName": null,
                                "icon": "",
                                "noCache": false,
                                "link": null
                            },
                            "platformId": 1
                        }
                    ],
                    "platformId": 1
                },
            ],
            "platformId": 1
        }
    ]
}