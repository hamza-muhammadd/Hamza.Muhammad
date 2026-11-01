-- Optional: refreshes site texts that still equal the OLD built-in wording, so the improved wording shows.
-- Anything you edited yourself is left untouched. Safe to run more than once.

update site_settings set data = data - 'intro' where id = 1 and data->>'intro' = $t$I care about religion, education, technology, and building useful things that serve people.$t$;
update site_settings set data = data - 'intro' where id = 1 and data->>'intro' = $t$I care about Qur’an, Arabic, education, technology, and building useful things that serve people.$t$;
update site_settings set data = data - 'about' where id = 1 and data->>'about' = $t$I’m Hamza Muhammad, an educator and lifelong learner interested in Qur’anic studies, Arabic, teaching, technology, entrepreneurship, and personal development.

I’m interested in the space between knowledge and action: understanding an idea, recalling it, applying it in real situations, measuring the result, and improving the process.

My goal is to keep learning, build useful projects, and share what I discover in ways that can benefit other people.$t$;
update site_settings set data = data - 'glance' where id = 1 and data->>'glance' = $t$Education | Teaching and continuous learning
Faith | Qur’an, Arabic, and daily practice
Building | Digital products and software ideas
Curiosity | Reading, languages, and travel$t$;
update site_settings set data = data - 'interests' where id = 1 and data->>'interests' = $t$Knowledge & learning | Study and understanding | Qur’an, Arabic, Education, Teaching, Reading, Language learning, Personal growth
Digital world | Technology & entrepreneurship | AI, Technology, Web development, Entrepreneurship, Branding, Product management, Digital products
Life & experience | People and the world | Travel, Adventure travel, Communication, Relationships, Mindfulness, Culture, Meaningful experiences$t$;
update site_settings set data = data - 'accounts_intro' where id = 1 and data->>'accounts_intro' = $t$Find me on the platforms I use.$t$;
update site_settings set data = data - 'contact_intro' where id = 1 and data->>'contact_intro' = $t$For collaboration, education, technology, or a meaningful conversation, choose the most convenient way to reach me.$t$;
