console.log("tree_generator.ts loaded");

/**
 * Generates the pendulum tree with n pendulums using the pruefer sequence.
 * @param n The number of pendulums. (at least 2)
 * @returns The root pendulum.
 */
function generatePendulumTree(n: number = settings.pendulum_count + 1): Pendulum {
    // creates the sequence
    const sequence: number[] = [];
    for (let i=0; i<n-2; i++) { sequence.push(randomInt(0, n-1)); }
    // creates n pendulums (labeled from 0 to n-1)
    const pendulums: Pendulum[] = [];
    for (let i=0; i<n; i++) {pendulums[i] = new Pendulum();}
    // create the list with 0 to n-1
    const list: number[] = [];
    for (let i=0; i<n; i++) {list.push(i);}

    while (list.length > 2) {
        // find the smallest number in the list which is not in the sequence
        const s = Math.min(...list.filter(v => !sequence.includes(v)));
        // deletes the first number from the list
        list.splice(list.indexOf(s), 1);
        // gets and deletes the first number from the sequence
        const f = sequence.shift()!;
        addEdge(s,f);
    }
    addEdge(list[0], list[1]);

    const root = pendulums[0];
    makeTreeDirected(root);
    root.updateHierarchie();
    root.visible = false;

    printTree(root);

    return pendulums[0];

    function addEdge(a: number, b: number): void {
        if (!pendulums[a].children.includes(pendulums[b])) {
            pendulums[a].children.push(pendulums[b]);
        }
        if (!pendulums[b].children.includes(pendulums[a])) {
            pendulums[b].children.push(pendulums[a]);
        }
    }
}

/**
 * Removes edges to parents.
 * @param root 
 */
function makeTreeDirected(root: Pendulum): void {
    for (const child of root.children) {
        child.children.splice(child.children.indexOf(root), 1);
        makeTreeDirected(child);
    }
}

/**
 * Prints the pendulum tree.
 * @param root The root pendulum.
 * @param indent The indentation level.
 */
function printTree(root: Pendulum, indent: string = "-"): void {
    console.log(indent, root.id, root);
    root.children.forEach(child => printTree(child, indent + "-"));
}