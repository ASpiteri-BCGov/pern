#! /usr/bin/env node

const path = require("path");
const fs = require("fs");

const consoleSuccess = "\x1b[32m";
const consoleError = "\x1b[31m";
const consoleClear = "\x1b[0m";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.stdoutMuted = true;

readline.question(
  "What is the name of your project? \n The project name can only contain letters[Aa], numbers[123], dashes[-], underscores[_] and spaces[ ] \n",
  (projectname) => {
    /*Check if name contains quotes*/
    if (!projectname.match(/^[a-zA-Z0-9_-\s]*$/)) {
      console.log(
        consoleError,
        "Cannot create a project with quotes in the name",
        consoleClear,
        projectname
      );
      console.log(consoleClear, ""); //Reset colors
      process.exit(1);
    }

    readline.question(
      "What do you want to name your database? \n The database name can only contain letters[Aa], numbers[123], dashes[-] and underscores[_]\n",
      (dbname) => {
        if (!dbname.match(/^[a-z0-9_-]*$/)) {
          console.log(
            consoleError,
            "The database name can only contain lowercase letters[ab], numbers[123], dashes[-] and underscores[_]\n",
            consoleClear,
            dbname
          );
          console.log(consoleClear, ""); //Reset colors
          process.exit(1);
        }
        readline.question(
          "What should we call your first database table? \n The database table name can only contain letters[Aa], numbers[123], dashes[-] and underscores[_]\n",
          (dbtname) => {
            //Check if name contains quotes
            if (!dbtname.match(/^[a-z0-9_-]*$/)) {
              console.log(
                consoleError,
                "The database table name can only contain lowercase letters[ab], numbers[123], dashes[-] and underscores[_]",
                consoleClear,
                dbtname
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
                  if (err) {
                    console.log(err);
                    process.exit(1);
                  }
                  console.log(res);

                  pool = new Pool({
                    user: "postgres",
                    host: "localhost",
                    password: dbpassword,
                    database: dbname,
                    port: 5432,
                  });

                  pool.query(
                    `CREATE TABLE ${dbtname}(${dbtname}_id SERIAL PRIMARY KEY,description VARCHAR(255));`,
                    (err, res) => {
                      if (err) {
                        console.log(err);
                        process.exit(1);
                      }
                      console.log(res);
                      pool.end();
                    }
                  );
                });
                /*****END*********Create a database**************/
                /*============START=========================Create Nextjs app=====================================*/

                const child_process = require("child_process");
                //You can alos put creat-next-app
                child_process.execSync(
                  `npx create-react-app client --template typescript`,
                  {
                    stdio: [0, 1, 2],
                  }
                );
                /*============END=========================Create Nextjs app=====================================*/

                /*============START=========================add server directory=====================================*/

                const servertDir = "server";

                if (!fs.existsSync(servertDir)) {
                  fs.mkdirSync(servertDir, { recursive: true });
                }
                /*===========END==========================add server directory=====================================*/

                /*============START=========================add gitignore for server=====================================*/

                fs.appendFile(
                  "server/.gitignore",
                  "node_modules",
                  function (err) {
                    if (err) throw err;
                    console.log(
                      consoleSuccess,
                      "Success server/.gitignore created!"
                    );
                    console.log(consoleClear, ""); //Reset colors
                  }
                );

                /*===========END==========================add gitignore for server=====================================*/
                /*============START=========================Create API config=====================================*/
                const serverIndex = path.join(
                  __dirname,
                  "TemplateContents/server/index.js"
                );

                fs.readFile(serverIndex, "utf8", function (err, data) {
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
                });
                /*=============END========================Create API config=====================================*/
                /*===========START==========================Create db config=====================================*/
                const serverDB = path.join(
                  __dirname,
                  "TemplateContents/server/db.js"
                );

                fs.readFile(serverDB, "utf8", function (err, data) {
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
                });
                /*===========END==========================Create db config=====================================*/
                /*===========START==========================Create server package.json and package-lock.json=====================================*/

                const serverPackageLock = path.join(
                  __dirname,
                  "TemplateContents/server/package-lock.json"
                );

                fs.readFile(serverPackageLock, "utf8", function (err, data) {
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
                });

                const serverPackageJson = path.join(
                  __dirname,
                  "TemplateContents/server/package.json"
                );
                fs.readFile(serverPackageJson, "utf8", function (err, data) {
                  fs.appendFile("server/package.json", data, function (err) {
                    if (err) throw err;
                    console.log(
                      consoleSuccess,
                      "Success server/package.json created!"
                    );
                    console.log(consoleClear, ""); //Reset colors
                  });
                });

                /*===========END==========================Create server package.json and package-lock.json=====================================*/
                /*============START=========================add client components directory=====================================*/

                const clientComponents = "client/src/components";

                if (!fs.existsSync(clientComponents)) {
                  fs.mkdirSync(clientComponents, { recursive: true });
                }
                /*============END=========================add client components directory=====================================*/
                /*===========START==========================Create example components=====================================*/
                const Appjs = path.join(
                  __dirname,
                  "TemplateContents/client/src/App.js"
                );

                // START Edit example //
                fs.readFile(Appjs, "utf8", function (err, data) {
                  fs.writeFile("client/src/App.tsx", data, function (err) {
                    if (err) throw err;
                    console.log("App.tsx Created!");
                  });
                });

                const EditExample = path.join(
                  __dirname,
                  "TemplateContents/client/src/components/EditExample.js"
                );

                // START Edit example //
                fs.readFile(EditExample, "utf8", function (err, data) {
                  fs.appendFile(
                    "client/src/components/EditExample.js",
                    data,
                    function (err) {
                      if (err) throw err;
                      console.log("EditExample.js Created!");
                    }
                  );
                });
                // END Edit example //

                //START Input Example //
                const InputExample = path.join(
                  __dirname,
                  "TemplateContents/client/src/components/InputExample.js"
                );

                fs.readFile(InputExample, "utf8", function (err, data) {
                  fs.appendFile(
                    "client/src/components/InputExample.js",
                    data,
                    function (err) {
                      if (err) throw err;
                      console.log("InputExample.js Created!");
                    }
                  );
                });
                //END Input Example //

                //START List Example //
                const ListExample = path.join(
                  __dirname,
                  "TemplateContents/client/src/components/ListExample.js"
                );

                fs.readFile(ListExample, "utf8", function (err, data) {
                  fs.appendFile(
                    "client/src/components/ListExample.js",
                    data,
                    function (err) {
                      if (err) throw err;
                      console.log("ListExample.js Created!");
                    }
                  );
                });
                //END List Example //
                /*===========END==========================Create example components=====================================*/

                /*============START=========================add openshift directories=====================================*/
                const openshiftDir = "openshift";

                if (!fs.existsSync(openshiftDir)) {
                  fs.mkdirSync(openshiftDir, { recursive: true });
                }

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

                /*===========END==========================add openshift directories=====================================*/

                /*===========START==========================add openshift knp=====================================*/
                const knpyml = path.join(
                  __dirname,
                  "TemplateContents/openshift/knp.yml"
                );
                fs.readFile(knpyml, "utf8", function (err, data) {
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
                });
                /*===========END==========================add openshift knp=====================================*/
                /*===========START==========================add openshift client/bc.yaml=====================================*/

                const bcyaml = path.join(
                  __dirname,
                  "TemplateContents/openshift/client/bc.yaml"
                );
                fs.readFile(bcyaml, "utf8", function (err, data) {
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
                });
                /*===========END==========================add openshift client/bc.yaml=====================================*/
                /*===========START==========================add openshift client/dc.yaml=====================================*/
                const clientDcYaml = path.join(
                  __dirname,
                  "TemplateContents/openshift/client/dc.yaml"
                );
                fs.readFile(clientDcYaml, "utf8", function (err, data) {
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
                });
                /*===========END==========================add openshift client/dc.yaml=====================================*/

                /*===========START==========================add openshift database/db-deploy.yml=====================================*/
                const dbDeployYaml = path.join(
                  __dirname,
                  "TemplateContents/openshift/database/db-deploy.yml"
                );
                fs.readFile(dbDeployYaml, "utf8", function (err, data) {
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
                });
                /*===========END==========================add openshift database/db-deploy.yml=====================================*/

                /*===========START==========================add openshift/database/db-secrets.yml=====================================*/
                const dbsecretsyaml = path.join(
                  __dirname,
                  "TemplateContents/openshift/database/db-secrets.yml"
                );
                fs.readFile(dbsecretsyaml, "utf8", function (err, data) {
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
                });
                /*===========END==========================add openshift/database/db-secrets.yml=====================================*/

                /*===========START==========================add openshift/server/bc.yaml=====================================*/
                const serverBcYaml = path.join(
                  __dirname,
                  "TemplateContents/openshift/server/bc.yaml"
                );
                fs.readFile(serverBcYaml, "utf8", function (err, data) {
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
                });
                /*===========END==========================add openshift/server/bc.yaml=====================================*/

                /*===========START==========================add openshift/server/dc.yaml=====================================*/
                const serverDcYaml = path.join(
                  __dirname,
                  "TemplateContents/openshift/server/dc.yaml"
                );
                fs.readFile(serverDcYaml, "utf8", function (err, data) {
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
                });
                /*===========END==========================add openshift/server/dc.yaml=====================================*/

                /*===========START==========================add openshift/knp.yml"=====================================*/

                const bcYaml = path.join(
                  __dirname,
                  "TemplateContents/openshift/knp.yml"
                );
                fs.readFile(bcYaml, "utf8", function (err, data) {
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
                    function (err) {
                      if (err) return console.log(err);
                    }
                  );
                });
                /*===========END==========================add openshift/knp.yml"=====================================*/

                /**Last question */
              }
            );
          }
        );
      }
    );
  }
);
