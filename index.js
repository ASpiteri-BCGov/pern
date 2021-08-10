const createPernStack = () => {
  const fs = require("fs");

  const consoleSuccess = "\x1b[32m";
  const consoleError = "\x1b[31m";
  const consoleClear = "\x1b[0m";

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.stdoutMuted = true;

  let projectName = readline.question("What is the name of your project?");

  readline.question("What is the name of your project?", (projectname) => {
    /*Check if name contains quotes*/
    if (projectname.match(/"|'/gm)) {
      console.log(
        consoleError,
        "Cannot create a project with quotes in the name"
      );
      console.log(consoleClear, ""); //Reset colors
      process.exit(1);
    }

    readline.question("What do you want to name your database?", (dbname) => {
      if (dbname.match(/"|'/gm)) {
        console.log(
          consoleError,
          "Cannot create a database with quotes in the name"
        );
        console.log(consoleClear, ""); //Reset colors
        process.exit(1);
      }
      readline.question(
        "What should we call your first database table?",
        (dbtname) => {
          //Check if name contains quotes
          if (dbtname.match(/"|'/gm)) {
            console.log(
              consoleError,
              "Cannot create a database table with quotes in the name"
            );
            console.log(consoleClear, ""); //Reset colors
            process.exit(1);
          }

          readline.question(
            "What is the master password for your PSql database?",
            async (dbpassword) => {
              readline.close();

              /*****START*********Create a database**************/
              const { Pool, Client } = require("pg");

              let pool = new Pool({
                user: "postgres",
                host: "localhost",
                password: dbpassword,
                port: 5432,
              });

              pool.query(`CREATE DATABASE ${dbname};`, (err, res) => {
                pool = new Pool({
                  user: "postgres",
                  host: "localhost",
                  password: dbpassword,
                  database: dbname,
                  port: 5432,
                });
                console.log(err, res);

                pool.query(
                  `CREATE TABLE ${dbtname}(${dbtname}_id SERIAL PRIMARY KEY,description VARCHAR(255));`,
                  (err, res) => {
                    console.log(err, res);
                    pool.end();
                  }
                );
              });
              /*============START=========================add server directory=====================================*/

              const servertDir = "server";

              if (!fs.existsSync(servertDir)) {
                fs.mkdirSync(servertDir, { recursive: true });
              }
              /*===========END==========================add server directory=====================================*/

              /*============START=========================add gitignore for server=====================================*/

              fs.readFile(
                "TemplateContents/server/.gitignore",
                function (err, data) {
                  fs.appendFile("server/.gitignore", data, function (err) {
                    if (err) throw err;
                    console.log(
                      consoleSuccess,
                      "Success server/.gitignore created!"
                    );
                  });
                }
              );
              /*===========END==========================add gitignore for server=====================================*/

              /*============START=========================Create API config=====================================*/

              fs.readFile(
                "TemplateContents/server/index.js",
                "utf8",
                function (err, data) {
                  const mapObj = {
                    $dbtname: dbtname,
                  };

                  let databaseReplacements = data.replace(
                    /\$dbtname/gi,
                    (matched) => mapObj[matched]
                  );
                  if (err) {
                    return console.log(err);
                  }

                  fs.appendFile(
                    "server/index.js",
                    databaseReplacements,
                    "utf8",
                    function (err) {
                      if (err) return console.log(err);
                    }
                  );
                }
              );
              /*=============END========================Create API config=====================================*/

              /*===========START==========================Create db config=====================================*/

              fs.readFile(
                "TemplateContents/server/db.js",
                "utf8",
                function (err, data) {
                  const mapObj = {
                    $dbname: `"${dbname}"`,
                    $dbpassword: `"${dbpassword}"`,
                  };

                  let databaseReplacements = data.replace(
                    /\$dbname|\$dbpassword/gi,
                    (matched) => mapObj[matched]
                  );
                  if (err) {
                    return console.log(err);
                  }

                  fs.appendFile(
                    "server/db.js",
                    databaseReplacements,
                    "utf8",
                    function (err) {
                      if (err) return console.log(err);
                    }
                  );
                }
              );

              /*===========END==========================Create db config=====================================*/

              /*===========START==========================Create server package.json and package-lock.json=====================================*/
              fs.readFile(
                "TemplateContents/server/package-lock.json",
                function (err, data) {
                  fs.appendFile(
                    "server/package-lock.json",
                    data,
                    function (err) {
                      if (err) throw err;
                      console.log(
                        consoleSuccess,
                        "Success server/package-lock.json created!"
                      );
                      console.log(consoleClear, ""); //Reset colors
                    }
                  );
                }
              );
              fs.readFile(
                "TemplateContents/server/package.json",
                function (err, data) {
                  fs.appendFile("server/package.json", data, function (err) {
                    if (err) throw err;
                    console.log(
                      consoleSuccess,
                      "Success server/package.json created!"
                    );
                    console.log(consoleClear, ""); //Reset colors
                  });
                }
              );

              /*===========END==========================Create server package.json and package-lock.json=====================================*/
              /*============START=========================Create example components =====================================*/
              const clientDir = "client/src/components";

              if (!fs.existsSync(clientDir)) {
                fs.mkdirSync(clientDir, { recursive: true });
              }
              // Edit example
              fs.readFile(
                "TemplateContents/client/src/components/EditExample.js",
                function (err, data) {
                  fs.appendFile(
                    "client/src/components/EditExample.js",
                    data,
                    function (err) {
                      if (err) throw err;
                      console.log("EditExample.js Created!");
                    }
                  );
                }
              );

              //Input Example
              fs.readFile(
                "TemplateContents/client/src/components/InputExample.js",
                function (err, data) {
                  fs.appendFile(
                    "client/src/components/InputExample.js",
                    data,
                    function (err) {
                      if (err) throw err;
                      console.log("InputExample.js Created!");
                    }
                  );
                }
              );

              // List Example
              fs.readFile(
                "TemplateContents/client/src/components/ListExample.js",
                function (err, data) {
                  fs.appendFile(
                    "client/src/components/ListExample.js",
                    data,
                    function (err) {
                      if (err) throw err;
                      console.log("ListExample.js Created!");
                    }
                  );
                }
              );

              /*===========END==========================Create example components=====================================*/
            }
          );

          /*============START=========================create openshift configs=====================================*/
          const openshiftDir1 = "openshift/client";

          if (!fs.existsSync(openshiftDir1)) {
            fs.mkdirSync(openshiftDir1, { recursive: true });
          }

          const openshiftDir2 = "openshift/database";

          if (!fs.existsSync(openshiftDir2)) {
            fs.mkdirSync(openshiftDir2, { recursive: true });
          }

          const openshiftDir3 = "openshift/server";

          if (!fs.existsSync(openshiftDir3)) {
            fs.mkdirSync(openshiftDir3, { recursive: true });
          }
          fs.readFile(
            "TemplateContents/openshift/knp.yml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.writeFile(
                `./openshift/knp.yml`,
                databaseReplacements,
                (err) => {
                  if (err) console.error("error" + err);

                  console.warn("successfully created");
                }
              );
            }
          );

          fs.readFile(
            "TemplateContents/openshift/client/bc.yaml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.appendFile(
                "openshift/client/bc.yaml",
                databaseReplacements,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );

          fs.readFile(
            "TemplateContents/openshift/client/dc.yaml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.appendFile(
                "openshift/client/dc.yaml",
                databaseReplacements,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );

          fs.readFile(
            "TemplateContents/openshift/database/db-deploy.yml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.appendFile(
                "openshift/database/db-deploy.yml",
                databaseReplacements,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );

          fs.readFile(
            "TemplateContents/openshift/database/db-secrets.yml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.appendFile(
                "openshift/database/db-secrets.yml",
                databaseReplacements,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );

          fs.readFile(
            "TemplateContents/openshift/server/bc.yaml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.appendFile(
                "openshift/server/bc.yaml",
                databaseReplacements,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );

          fs.readFile(
            "TemplateContents/openshift/server/dc.yaml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.appendFile(
                "openshift/server/dc.yaml",
                databaseReplacements,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );

          fs.readFile(
            "TemplateContents/openshift/knp.yml",
            "utf8",
            function (err, data) {
              const mapObj = {
                $projectname: projectname,
              };

              let databaseReplacements = data.replace(
                /\$projectname/gi,
                (matched) => mapObj[matched]
              );
              if (err) {
                return console.log(err);
              }

              fs.appendFile(
                "openshift/knp.yml",
                databaseReplacements,
                "utf8",
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          );

          /*===========END==========================create openshift configs=====================================*/

          // const child_process = require("child_process");

          // child_process.execSync(`npx create-next-app client`, {
          //   stdio: [0, 1, 2],
          // });
        } //last question
      );
    });
  });
};

module.exports = createPernStack;
