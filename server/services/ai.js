require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function main(firstName, lastName, posts, userDescription) {
  const jsonExample = `{"experiences":[{"year":"2010","duration":"2 years","place":"University of XYZ","position":"Teacher of XYZ","tasks":["Task 1","Task 2","Task 3"],"achievements":["Achievement 1","Achievement 2","Achievement 3"]},{"year":"2012","duration":"3 years","place":"University of ABC","position":"Teacher of ABC","tasks":["Task 4","Task 5","Task 6"],"achievements":["Achievement 4","Achievement 5","Achievement 6"]}],"interests":["Reading","Traveling","Coding","Music"],"skills":[{"type":"Technical","skills":["JavaScript","Node.js","Express.js"]},{"type":"Interpersonal","skills":["Teamwork","Communication","Leadership"]},{"type":"Organizational","skills":["Project Management","Time Management","Strategic Planning"]}],"licenses":[{"name":"Software Development License","placeOfIssue":"XYZ Licensing Authority","issueDate":"2015","description":"License for software development"},{"name":"Web Development License","placeOfIssue":"ABC Licensing Authority","issueDate":"2017","description":"License for web development"}],"educations":[{"university":"University of XYZ","startYear":"2005","endYear":"2009","graduationYear":"2009","course":"Computer Science","studyType":"Bachelor","specialty":"Software Development"},{"university":"University of ABC","startYear":"2010","endYear":"2012","graduationYear":"2012","course":"Computer Science","studyType":"Master","specialty":"Web Development"}]}`;
  const question = 
`I wrote this JSON:

${jsonExample}

Generate other JSON that must be your only response. Do not summarize or introduce your code. 
The JSON must contain data that fits to known person named ${firstName} ${lastName}. 
JSON will be parsed to fit into a CV template. Avoid using double quotes that may be incorrect for JSON. 
Do not answer with the code I provided, it is only an example, you need to keep the structure. 
Limit number of tasks and achievements to 2 each. 
Here are posts of the user: ${posts}.

The user's profile description is: ${userDescription}. 

It should help you to generate the JSON if you do not know anything about the person.
Do not reuse values from the JSON I provided.`;

  console.log("Using values:", firstName, lastName, posts, userDescription);

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: question }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

module.exports = main;