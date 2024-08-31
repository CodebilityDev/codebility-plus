import { Codev } from "./codev";

export interface User {
    id: string;
    email: string;

    codev?: Codev; // relational data type
    profile?: Profile; // relational data type
}

export interface Profile {
    first_name: string;
    last_name: string;
    image_url: string;
    main_position: string;

    user?: User; // for relational data type
}