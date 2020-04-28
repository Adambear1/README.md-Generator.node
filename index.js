const inquirer = require('inquirer')
const fs = require('fs')
const axios = require('axios')
const util = require('util')
// const gm = require('./utils/generateMarkdown')
const dedent = require('dedent')

const writeFileAsync = util.promisify(fs.writeFile);

inquirer.prompt([
    {
        type: 'input',
        message: 'What is your name?',
        name: 'username',
    },
    {
        type: 'input',
        message: 'What are the gitHub username?',
        name: 'username',
    },
    {
        type: 'input',
        message: 'What is the name of the project?',
        name: 'projectname',
    },
    {
        type: 'input',
        message: 'What is the description of the project?',
        name: 'description',
    }
    //Creates file
])
    .then((data) => {

        const { name, username, projectname, description } = data


        const queryUrl = `https://api.github.com/users/${username}`;
        const repoUrl = `https://api.github.com/users/${username}/repos?per_page=100`

        axios.get(queryUrl)
            .then((res) => {
                const imageUrl = `${res.data.avatar_url}&s=1000`
                const accountUrl = `${res.data.url}`
                const repos = `https://api.github.com/users/${username}/repos`

                axios.get(repos)
                    .then((repos) => {
                        // const returnednames = [];
                        const repoNames = repos.data.map(function (repo) {
                            const returnednames = [repo.name, repo.html_url, repo.description, repo.language];

                            return returnednames
                            // return repo.name
                        })

                        const [reponame, url, desc, lang] = repoNames

                        const repoNameStr = JSON.stringify(reponame.join("\n"))
                        const repoUrlStr = JSON.stringify(url.join("\n"))
                        const repoDescriptionStr = JSON.stringify(desc.join("\n"))
                        const repoLanguageStr = JSON.stringify(lang.join("\n"))

                        // console.log(repos)

                        const mdFile = dedent(`
                            #${projectname}
                            
                            ##Description
                            
                            ${description}
                            
                            ##Table of Contents
                            * [Technologies Used](#technologies)
                            *[Installation](#installation)
                            *[Usage](#usage)
                            *[Credits](#credits)
                            *[Badges](#badges)
                            *[Contributing](#contributing)
                            *[Tests](#tests)
                            *[License](#license)

                            ##Overview
                            # This project was created, reviewed, and deployed by ${name} **Github link: ${accountUrl}**
                            !['alt text'](${imageUrl})
                            # Past repos 
                            **${repoNameStr}
                            **${repoUrlStr}
                            **${repoDescriptionStr}
                            **${repoLanguageStr}
                            
                            `);

                        return writeFileAsync('README.MD', mdFile)
                    })
            })


        //

    }).catch(function (err) {
        if (err) throw err
        console.log('success!')
    })


                // console.log(res)







