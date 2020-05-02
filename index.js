const inquirer = require('inquirer')
const fs = require('fs')
const axios = require('axios')
const util = require('util')
const dedent = require('dedent')

const writeFileAsync = util.promisify(fs.writeFile);

inquirer.prompt([
    {
        type: 'input',
        message: 'What is your name?',
        name: 'name',
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
    },
    {
        type: 'list',
        message: 'What is the primary coding language of the project?',
        name: 'languages',
        choices: [
            'HTML',
            'CSS',
            'JavaScript',
            'NODE JS',
            'React',
            'MongoDB',
            'MySQL'
        ]
    },
    {
        type: 'input',
        message: 'Who helped contribute during this project?',
        name: 'contributers',
    },
    {
        type: 'input',
        message: 'Please briefly describe the usage and purpose of the project?',
        name: 'usage',
    },

    //Creates file
])
    .then((data) => {

        const { name, username, projectname, description, languages, contributers, usage } = data

        const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl)
            .then((res) => {
                const imageUrl = `${res.data.avatar_url}&s=1000`
                const accountUrl = `${res.data.url}`
                const repos = `https://api.github.com/users/${username}/repos`

                axios.get(repos)
                    .then((repos) => {

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
                        
                            [![](https://img.shields.io/apm/MIT)](https://${username}.github.io/${projectname}/.)
                            [![](https://img.shields.io/github/pipenv/locked/python-version/${username}/${projectname}?style=plastic)](https://${username}.github.io/${projectname}/.)
                            [![](https://img.shields.io/visual-studio-app-center/releases/size/${username}/${projectname}/null)](https://${username}.github.io/${projectname}/.)
                            
                            


                            # ${projectname}   
                            ### ${description}
                            
                            # Table of Contents
                            * [Primary Technology](#tecnology)
                            * [Installation](#installation)
                            * [Usage](#usage)
                            * [Contributing](#contributing)
                            
                            ### [Primary Technology](#technology)
                            * ${languages}

                            ### [Installation](#installation)
                            * Please follow GitHub link above to clone or fork repository. To sample the complete project, please click [here](https://${username}.github.io/${projectname}/.). To browse the source code of the project, please click [here](https://github.com/${username}/${projectname})

                            ### [Usage](#usage)
                            * This application was created and designed solely for purposes of learning, applying, and deploying mock applications for educational purposes. Please do not infringe or plagerize the code provided below.
                            * ${usage}

                            ### [Contributers](#contributers)
                            * The following helped contribute to this project: ${contributers}


                            # Author Overview
                            ## This project was created, reviewed, and deployed by ${name} 

                            !['profile picture'](${imageUrl})

                                                        
                            **Github link: ${accountUrl}**


                            # Past repos 
                            ### ${repoNameStr}__
                            ### ${repoUrlStr}__
                            ### ${repoDescriptionStr}__

                            
                            `);

                        return writeFileAsync('README.MD', mdFile)
                    })
            })


        //

    }).catch(function (err) {
        if (err) throw err
        console.log('success!')
    })







