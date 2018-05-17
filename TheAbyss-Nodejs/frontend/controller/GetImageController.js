const fs = require('fs')
const Sanita = require('../../log/Sanita')
const Utility = require('../../utility/Utility')

exports.actionTest = async function (req, res, next) {
    try {
        var a = 123;
        fs.readFile('/home/fcode4/Documents/MyCode/TheAbyss-Angular2/TheAbyss/src/app/app.component.html', "utf8", function (err, data) {
            if (err)
                return res.json(Utility.error(err.message, err));

            //var match = data.match(/<form class=form-horizontal id=Step1>([\s\S]*?)<\/form>/i);
            var match = data.match(/assets\/static\/img\/([\s\S]*?)"/g);
            match = match.map(x => x.replace('"', '').replace('assets/static/img/', '').replace(/\)([\S]*)/, ''));

            var set = new Set(match);
            match = [...set];

            //Get new folder
            newFolders = new Set();
            match.map(x => {
                var folder = x.split('/');
                if (folder[1])
                    newFolders.add(folder[0]);
            });

            newFolders = Array.from(newFolders);

            var linkSave = '/home/fcode4/Documents/MyCode/TheAbyss-Angular2/TheAbyss/src/assets/static/img/';

            download = match.map(x => {
                return 'wget  -P ' + linkSave + (x.includes('/') ? (x.split('/')[0] + '/') : '') + ' "https://www.theabyss.com/static/img/' + x + '"';
            });

            rename = match.map(x => {
                return 'mv ' + linkSave + x + '   ' + linkSave + x.split('?')[0];
            });

            //var linkShell = '/home/fcode4/Documents/MyCode/toolNodejs/log/test.txt';
            var linkShell = '/home/fcode4/Desktop/command/test.sh';

            fs.writeFile(linkShell, '', function (err) {
                if (err)
                    return res.json(Utility.error(err.message, err));
                fs.appendFileSync(linkShell, '#!/bin/bash' + '\n');

                //Create new Folder
                newFolders.map(x => {
                    var linkFolder = '/home/fcode4/Documents/MyCode/TheAbyss-Angular2/TheAbyss/src/assets/static/img/' + x;
                    if (!fs.existsSync(linkFolder)) {
                        fs.appendFileSync(linkShell, 'mkdir ' + linkFolder + ' \n');
                    }
                });

                fs.appendFileSync(linkShell, '\n\n\n\n\n\n\n\n');

                download.map(x => {
                    fs.appendFileSync(linkShell, x + '\n');
                });

                fs.appendFileSync(linkShell, '\n\n\n\n\n\n\n\n');

                rename.map(x => {
                    if (x.includes('?'))
                        fs.appendFileSync(linkShell, x + '\n');
                });
                return res.json(match);
            });
        });
    } catch (error) {
        Sanita.error(error);
        return res.json(Utility.error('Error occurs. Please try again.', null));
    }
}

/**
 * @param  string data
 */
function filterFolderDaico(data) {
    var match = data.match(/assets\/static\/img\/daico\/([\S0-9]*?)\)/g);
    if (!match) return null;
    match = match.map(x => x.replace('"', '').replace('assets/static/img/daico/', '').replace(/\)([\s\S]*)/, ''));
    match = [...new Set(match)];
    return match;
}

/**
 * @param  string data
 */
function filterFolderImg(data) {
    var match = data.match(/assets\/static\/img\/([\S0-9]*?)\)/g);
    if (!match) return null;
    match = match.map(x => x.replace('"', '').replace('assets/static/img/', '').replace(/\)([\s\S]*)/, ''));
    match = [...new Set(match)];
    return match;
}

/**
 * @param  string data
 */
function filterFolderJs(data) {
    var match = data.match(/assets\/static\/js\/([\S0-9]*?)"/g);
    if (!match) return null;
    match = match.map(x => x.replace('"', '').replace('assets/static/js/', '').replace(/\)([\s\S]*)/, ''));
    match = [...new Set(match)];
    return match;
}

/**
 * @param  string data
 */
function filterFolderStyles(data) {
    var match = data.match(/assets\/static\/styles\/([\S0-9]*?)"/g);
    if (!match) return null;
    match = match.map(x => x.replace('"', '').replace('assets/static/styles/', '').replace(/\)([\s\S]*)/, ''));
    match = [...new Set(match)];
    return match;
}

exports.actionTest1 = async function (req, res, next) {
    try {
        var a = 123;
        fs.readFile('/home/fcode4/Documents/MyCode/TheAbyss-Angular2/TheAbyss/src/app/html/de.component.html', "utf8", function (err, data) {
            if (err)
                return res.json(Utility.error(err.message, err));


            //var match = data.match(/<form class=form-horizontal id=Step1>([\s\S]*?)<\/form>/i);
            //var match = data.match(/assets\/static\/img\/([\S0-9]*?)\) /g);
            //match = filterFolderDaico(data);
            match = filterFolderStyles(data);

            if (!match)
                return res.json(Utility.error('Not find', null));

            //Get new folder
            newFolders = new Set();
            match.map(x => {
                var folder = x.split('/');
                if (folder[1])
                    newFolders.add(folder[0]);
            });

            newFolders = Array.from(newFolders);

            var linkChange = 'static/styles/';

            var linkSave = '/home/fcode4/Documents/MyCode/TheAbyss-Angular2/TheAbyss/src/assets/' + linkChange;

            download = match.map(x => {
                if (fs.existsSync(linkSave + x)) {
                    return null;
                }
                return 'wget  -P ' + linkSave + (x.includes('/') ? (x.split('/')[0] + '/') : '') + ' "https://www.theabyss.com/' + linkChange + x + '"';
            });

            rename = match.map(x => {
                return 'mv ' + linkSave + x + '   ' + linkSave + x.split('?')[0];
            });

            //var linkShell = '/home/fcode4/Documents/MyCode/toolNodejs/log/test.txt';
            var linkShell = '/home/fcode4/Desktop/command/test.sh';

            fs.writeFile(linkShell, '', function (err) {
                if (err)
                    return res.json(Utility.error(err.message, err));
                fs.appendFileSync(linkShell, '#!/bin/bash' + '\n');

                //Create new Folder
                newFolders.map(x => {
                    var linkFolder = linkSave + x;
                    if (!fs.existsSync(linkFolder)) {
                        fs.appendFileSync(linkShell, 'mkdir ' + linkFolder + ' \n');
                    }
                });

                fs.appendFileSync(linkShell, '\n\n\n\n\n\n\n\n');

                download.map(x => {
                    if (x)
                        fs.appendFileSync(linkShell, x + '\n');
                });

                fs.appendFileSync(linkShell, '\n\n\n\n\n\n\n\n');

                rename.map(x => {
                    if (x.includes('?'))
                        fs.appendFileSync(linkShell, x + '\n');
                });
                return res.json(match);
            });
        });
    } catch (error) {
        Sanita.error(error);
        return res.json(Utility.error('Error occurs. Please try again.', null));
    }
}