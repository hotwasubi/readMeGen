const inquirer = require("inquirer");
const axios = require('axios');
const fs = require('fs');

function buildRM() {
    inquirer
        .prompt({
            message: 'Choose the next element to add to your README.md',
            name: 'build',
            type: 'list',
            choices: ['title', 'description', 'image']
        }).then(function({ build }){
            if (build == 'title') {
                inquirer.prompt({
                    message: 'Enter your title',
                    name: 'title'
                }).then(function({ title }) {
                    const rm = `## ${title}
`
                    fs.appendFile('README.md', rm, function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log('You have added a title to your README')
                        inquirer.prompt({
                            message: 'Would you like to add more elements to your README?',
                            name: 'contin',
                            type: 'list',
                            choices: ['yes','no']
                        }).then(function({ contin }) {
                            if (contin == 'yes') {
                                buildRM();
                            } else {
                                buildFAQ();
                            }
                        })
                    })
                })
            } else if (build == 'description') {
                inquirer.prompt({
                    message: 'Enter your description',
                    name: 'description'
                }).then(function({ description }) {
                    const rm = `${description}
`
                    fs.appendFile('README.md', rm, function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log('You have added a description to your README')
                        inquirer.prompt({
                            message: 'Would you like to add more elements to your README?',
                            name: 'contin',
                            type: 'list',
                            choices: ['yes','no']
                        }).then(function({ contin }) {
                            if (contin == 'yes') {
                                buildRM();
                            } else {
                                buildFAQ();
                            }
                        })
                    })
                })
            } else [
                inquirer.prompt([{
                    message: 'Enter your image url',
                    name: 'image'
                },{
                    message: 'Enter your image description',
                    name: 'imageD'
                }]).then(function({ image,imageD }) {
                    const rm = `![${imageD}](${image})
`
                    fs.appendFile('README.md', rm, function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log('You have added a image to your README')
                        inquirer.prompt({
                            message: 'Would you like to add more elements to your README?',
                            name: 'contin',
                            type: 'list',
                            choices: ['yes','no']
                        }).then(function({ contin }) {
                            if (contin == 'yes') {
                                buildRM();
                            } else {
                                buildFAQ();
                            }
                        })
                    })
                })
            ]
        })
}

function buildFAQ() {
    inquirer
        .prompt([{
            message: 'Enter a FAQ (just the question not the answer)',
            name: 'question'
        },{
            message: 'Answer to FAQ',
            name:'answer'
        },{
            message: 'Would you like to add another FAQ?',
            name: 'contin',
            type: 'list',
            choices: ['yes','no']
        }]).then(function({ contin,answer,question }) {
            const FAQ = `#### ${question} 
            
${answer}
            
`
            fs.appendFile('README.md', FAQ, function(err) {
                if (contin == 'yes') {
                    buildFAQ();
                } else {
                    console.log('Your README is finished')
                }
            }) 
        })
}

inquirer
    .prompt([{
        message: 'What is your github username?',
        name: 'username'
    },{
        message:'What is the name of your project?',
        name: 'title'
    },{
        message: 'Enter your user story',
        name: 'userStory'
    }]).then(function({ username,title,userStory }) {
        const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`

        axios.get(queryUrl).then(function(res) {
            
            const rm = `# ${title}
![bio pic](${res.data[0].owner.avatar_url})
### Table of Contents
    * Contributors
    * User story
    * Description
    * FAQs
    * Tests
### Contributors
    * 
## User Story
${userStory}
`
            fs.writeFile('README.md', rm, function(err) {
                if (err) {
                    throw err;
                }

                console.log('Great! Your README.md has been initialized!')
                buildRM();
            })
        })
    })