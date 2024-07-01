const slugify = (text)=>{
    return text.toString().toLowerCase().trim()
        .replace(/[\s\W]+/g,'-')
        .replace(/^-+|-+$/g,'');
}


const generateUniqueSlug = async(text,Model)=>{
    let slug = slugify(text);
    let uniqueSlug = slug;
    let count = 1;

    while (await Model.findOne({slug: uniqueSlug})){
        uniqueSlug = `${slug}-${count}`;
        count++;
    }
    return uniqueSlug;
}
module.exports = {slugify, generateUniqueSlug};