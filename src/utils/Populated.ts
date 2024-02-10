type Populated<Base, Populator, Keys extends keyof Base> = {
    [P in keyof Base]: P extends Keys ? Populator : Base[P];
};

export default Populated;
