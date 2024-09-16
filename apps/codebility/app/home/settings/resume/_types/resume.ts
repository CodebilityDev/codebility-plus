export type Profile_Types = {
    id?: string
    first_name?: string
    last_name?: string 
    about?: string
    address?:string
    main_position?:string | null
    tech_stacks?: string[] | undefined
    updated_at?: string
    image_url?: string | null
    pronoun?: string | null
    start_time?: string | null
    end_time?: string | null
  }
  export type Social_Types = {
      id?: string,
      phone_no: string
      facebook: string
      linkedin: string
      whatsapp: string
      skype: string
      telegram: string
      portfolio_website: string
      user_id?: string
      github: string
  }