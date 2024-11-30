const entries = [
    '<img src="assets/images/html.png" alt="HTML" title="HTML">',
	'<img src="assets/images/C.png" alt="CLang" title="CLang">',
	'<img src="assets/images/cpp.png" alt="C++" title="C++">',
	'<img src="assets/images/docker.png" alt="Docker" title="Docker">',
	'<img src="assets/images/git.png" alt="Git" title="Git">',
	'<img src="assets/images/css.png" alt="CSS" title="CSS">',
	'<img src="assets/images/github.png" alt="Github" title="Github">',
	'<img src="assets/images/java.png" alt="Java" title="Java">',
	'<img src="assets/images/js.png" alt="JavaScript" title="JavaScript">',
	'<img src="assets/images/mysql.png" alt="MySQL" title="MySQL">',
	'<img src="assets/images/php.png" alt="PHP" title="PHP">',
	'<img src="assets/images/postgresql.png" alt="PostgreSQL" title="PostgreSQL">',
	'<img src="assets/images/python.png" alt="Python" title="Python">',
];
const settings = {
    radius: 200,
    maxSpeed: 'fast',
    initSpeed: 'normal',
	direction: 135,
    keep: true,
	useHTML: true
};
TagCloud('#sphere-container', entries, settings);

