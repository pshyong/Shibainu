const got = require('got');

const api_route = "/api/v1/";
exports.main_subpage = [
    async function (req, res, next) {
        const url = req.protocol + "://" + req.get('host') + api_route + "pages/Page/" + req.params.name;

        try {
            const response = await got.get(url, {
                hooks: {
                    afterResponse: [
                        (response) => {
                            if (response.statusCode === 404) {
                                res.render('pages/404');
                            }
                            return response;
                        }
                    ]
                }
            });
            console.log(response.body);
            res.render('pages/subpage', { title: 'shibainu | subpage', page: 'subpage', data: JSON.parse(response.body)});
        } catch (error) {
            console.log(error.response.body);
        }

        
    }
];

exports.main_page = [
    async function(req, res, next) {
        const url = req.protocol + "://" + req.get('host') + api_route + "AllNewThreads";
        
        try {
            const response = await got.get(url, {
                hooks: {
                    afterResponse: [
                        (response) => {
                            if (response.statusCode === 404) {
                                res.render('pages/404');
                            }
                            return response;
                        }
                    ]
                }
            });
            res.render('pages/index', { title: 'Shibainu', 'data': JSON.parse(response.body)});
        } catch (error) {
            console.log(error.response.body);
        }

    }
];
