const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const newStudents = [
  // Korean students
  {id:101,name:"K.Bella",nat:"🇰🇷 Korean",level:"Beginner",rate:30,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#A855F7",c2:"#6366F1",badges:[],paid:false,birthday:""},
  {id:102,name:"Jackie",nat:"🇰🇷 Korean",level:"Beginner",rate:25,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👦",c1:"#3B82F6",c2:"#06B6D4",badges:[],paid:false,birthday:""},
  {id:103,name:"Lina",nat:"🇰🇷 Korean",level:"Beginner",rate:30,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#EC4899",c2:"#F97316",badges:[],paid:false,birthday:""},
  {id:104,name:"Aiden",nat:"🇰🇷 Korean",level:"Beginner",rate:35,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👦",c1:"#10B981",c2:"#3B82F6",badges:[],paid:false,birthday:""},
  {id:105,name:"Sophia",nat:"🇰🇷 Korean",level:"Beginner",rate:35,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#F59E0B",c2:"#EF4444",badges:[],paid:false,birthday:""},
  {id:106,name:"Peter",nat:"🇰🇷 Korean",level:"Beginner",rate:35,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👦",c1:"#8B5CF6",c2:"#EC4899",badges:[],paid:false,birthday:""},
  {id:107,name:"Seah",nat:"🇰🇷 Korean",level:"Beginner",rate:25,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#14B8A6",c2:"#6366F1",badges:[],paid:false,birthday:""},
  // Chinese students
  {id:108,name:"Suri",nat:"🇨🇳 Chinese",level:"Beginner",rate:40,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#F97316",c2:"#EF4444",badges:[],paid:false,birthday:""},
  {id:109,name:"Bella",nat:"🇨🇳 Chinese",level:"Beginner",rate:30,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#EC4899",c2:"#A855F7",badges:[],paid:false,birthday:""},
  {id:110,name:"COCO-1",nat:"🇨🇳 Chinese",level:"Beginner",rate:35,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#F59E0B",c2:"#10B981",badges:[],paid:false,birthday:""},
  {id:111,name:"Harry",nat:"🇨🇳 Chinese",level:"Beginner",rate:40,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👦",c1:"#3B82F6",c2:"#8B5CF6",badges:[],paid:false,birthday:""},
  {id:112,name:"Kelly-Adult",nat:"🇨🇳 Chinese",level:"Intermediate",rate:45,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👩",c1:"#EF4444",c2:"#F97316",badges:[],paid:false,birthday:""},
  {id:113,name:"KAREN",nat:"🇨🇳 Chinese",level:"Beginner",rate:30,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#10B981",c2:"#14B8A6",badges:[],paid:false,birthday:""},
  {id:114,name:"Mollie-Adult & Steven",nat:"🇨🇳 Chinese",level:"Beginner",rate:25,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👫",c1:"#6366F1",c2:"#A855F7",badges:["Siblings"],paid:false,birthday:""},
  {id:115,name:"Coco-2",nat:"🇨🇳 Chinese",level:"Beginner",rate:35,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#F59E0B",c2:"#EC4899",badges:[],paid:false,birthday:""},
  {id:116,name:"Koala",nat:"🇨🇳 Chinese",level:"Beginner",rate:30,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"🐨",c1:"#8B5CF6",c2:"#3B82F6",badges:[],paid:false,birthday:""},
  {id:117,name:"Owen",nat:"🇨🇳 Chinese",level:"Beginner",rate:35,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👦",c1:"#14B8A6",c2:"#10B981",badges:[],paid:false,birthday:""},
  {id:118,name:"Rainy",nat:"🇨🇳 Chinese",level:"Beginner",rate:40,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#3B82F6",c2:"#06B6D4",badges:[],paid:false,birthday:""},
  {id:119,name:"Shily",nat:"🇨🇳 Chinese",level:"Beginner",rate:40,classes:10,total:10,duration:"50 min",schedule:"",attendance:100,avatar:"👧",c1:"#EC4899",c2:"#F59E0B",badges:[],paid:false,birthday:""},
];

// Find the default students array and replace it
const start = h.indexOf('let students=[');
const end = h.indexOf('];', start) + 2;
const newArr = 'let students=' + JSON.stringify(newStudents) + ';';
h = h.substring(0, start) + newArr + h.substring(end);

fs.writeFileSync('index.html', h, 'utf8');
console.log('students added:', newStudents.length);