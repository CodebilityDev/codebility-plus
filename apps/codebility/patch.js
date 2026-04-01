const fs = require('fs');
const file = 'app/home/orgchart/_components/OrgChart.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  `...(dept?.alias ? categorizedData[dept.alias] || [] : [])`,
  `...((dept && 'alias' in dept && dept.alias) ? categorizedData[dept.alias as string] || [] : [])`
);

data = data.replace(
  `+ (engineeringDepartments.find(d => d.key === expandedRole.key)?.alias ? (categorizedData[engineeringDepartments.find(d => d.key === expandedRole.key)!.alias!] || []).length : 0)`,
  `+ (engineeringDepartments.find(d => d.key === expandedRole.key)?.alias ? (categorizedData[engineeringDepartments.find(d => d.key === expandedRole.key)!.alias as string] || []).length : 0)`
);

fs.writeFileSync(file, data);
