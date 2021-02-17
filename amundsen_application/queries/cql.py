person_details_query = """
    MATCH (person:Person)
    WHERE person.id = $person_id
    OPTIONAL MATCH (person)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
    WHERE job.end_date IS NULL
    RETURN DISTINCT person.id AS id,
    person.full_name AS name,
    person.linkedin_url AS profile_url,
    person.headline AS headline,
    COLLECT(job.title) AS job_titles,
    COLLECT(company.name) AS company_names,
    COLLECT(company.linkedin_url) AS company_urls,
    person.description AS description,
    person.location AS location
"""

person_likers_query = """
    MATCH (person:Person{ id: $person_id })
    OPTIONAL MATCH (person)-[:POSTED]->(:Post)<-[l:LIKED]-(liker:Person)
    WHERE NOT(liker.id=person.id) AND TOSTRING(liker.full_name) = liker.full_name
    WITH DISTINCT liker, COUNT(l) as liked_posts
    OPTIONAL MATCH (liker)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
    RETURN DISTINCT liker.id AS id, liked_posts, liker.full_name AS name, liker.headline AS headline,
                    liker.linkedin_url AS profile_url, COLLECT(job.title) AS job_title,
                    COLLECT(company.name) AS company_name, COLLECT(company.linkedin_url) AS company_url
    ORDER BY liked_posts DESC
    LIMIT 20
"""

person_commentors_query = """
    MATCH (person:Person{ id: $person_id })
    OPTIONAL MATCH (person)-[:POSTED]->(:Post)<-[c:COMMENTED_ON]-(commentor:Person)
    WHERE NOT(commentor.id=person.id) AND TOSTRING(commentor.full_name) = commentor.full_name
    WITH DISTINCT commentor, COUNT(c) as commented_posts
    OPTIONAL MATCH (commentor)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
    RETURN DISTINCT commentor.id AS id, commented_posts, commentor.full_name AS name,
                    commentor.headline AS headline, commentor.linkedin_url AS profile_url,
                    COLLECT(job.title) AS job_title, COLLECT(company.name) AS company_name,
                    COLLECT(company.linkedin_url) AS company_url
    ORDER BY commented_posts DESC
    LIMIT 20
"""

person_likees_query = """
    MATCH (person:Person{ id: $person_id })
    OPTIONAL MATCH (person)-[l:LIKED]->(:Post)<-[:POSTED]-(liker:Person)
    WHERE NOT(liker.id=person.id) AND TOSTRING(liker.full_name) = liker.full_name
    WITH DISTINCT liker, COUNT(l) as liked_posts
    OPTIONAL MATCH (liker)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
    RETURN DISTINCT liker.id AS id, liked_posts, liker.full_name AS name, liker.headline AS headline,
                    liker.linkedin_url AS profile_url, COLLECT(job.title) AS job_title,
                    COLLECT(company.name) AS company_name, COLLECT(company.linkedin_url) AS company_url
    ORDER BY liked_posts DESC
    LIMIT 20
"""

person_commentees_query = """
    MATCH (person:Person{ id: $person_id })
    OPTIONAL MATCH (person)-[c:COMMENTED_ON]->(:Post)<-[:POSTED]-(commentor:Person)
    WHERE NOT(commentor.id=person.id) AND TOSTRING(commentor.full_name) = commentor.full_name
    WITH DISTINCT commentor, COUNT(c) as commented_posts
    OPTIONAL MATCH (commentor)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
    RETURN DISTINCT commentor.id AS id, commented_posts, commentor.full_name AS name,
                    commentor.headline AS headline, commentor.linkedin_url AS profile_url,
                    COLLECT(job.title) AS job_title, COLLECT(company.name) AS company_name,
                    COLLECT(company.linkedin_url) AS company_url
    ORDER BY commented_posts DESC
    LIMIT 20
"""
