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
      fb_link: string
      linkedin_link: string
      whatsapp_link: string
      skype_link: string
      telegram_link: string
      portfolio_website: string
      user_id?: string
      github_link: string
  }