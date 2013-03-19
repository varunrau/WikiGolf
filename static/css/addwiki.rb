File.open(ARGV.first).each_line do |l|
    if l.include?("{") && !l.include?("@media")
        ol = l.split(",").collect do |ls|
            next ".wiki-container #{ls}"
        end.join(", ")
        puts ol
    else
       puts l
    end
end
