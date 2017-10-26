library(tidyverse)
 dat <- read_csv("/home/alec/Projects/Brookings/digitalization/build/data/initial_handoff/sifan/ForAlec.csv")
 
 dat2 <- mutate(dat, level02 = (low02*1) + (medium02*2) + (high02*3), 
                      level16 = (low16*1) + (medium16*2) + (high16*3))
 
 ggplot(dat2) + geom_point(aes(x=jitter(level02), y=`Digital Score, 2002`), alpha=0.25, colour="red") +
                geom_point(aes(x=jitter(level16), y=`Digital Score, 2016`), alpha=0.25, colour="blue")
 
 sum02 <- dat2 %>% group_by(level02) %>% summarise(emp = sum(tot_emp2002)) %>% mutate(share = emp/sum(emp), year=2002)
 sum16 <- dat2 %>% group_by(level16) %>% summarise(emp = sum(tot_emp16)) %>% mutate(share = emp/sum(emp), year=2016)
 
 ggplot(dat2) + geom_segment(aes(y=`Digital Score, 2002`, yend=`Digital Score, 2016`, x=`Digital Score, 2002`, xend=`Digital Score, 2002`+3))
 
 ggplot(dat2) + geom_point(aes(x=`Digital Score, 2016`, y=`Digital Score, 2002`, size=tot_emp16)) + scale_size_area()
 
 #alt
 #sum02 <- dat2 %>% group_by(`Digital Skill level_2002`) %>% summarise(emp = sum(tot_emp2002)) %>% mutate(share = emp/sum(emp), year=2002)
 #sum16 <- dat2 %>% group_by(`Digital Skill level_2016`) %>% summarise(emp = sum(tot_emp16)) %>% mutate(share = emp/sum(emp), year=2016)
 
 #totals don't match -- category doesn't match
 
filter(as.data.frame(table(dat2$low02, dat2$medium02, dat2$high02, dat2$level02)), Freq > 0)
 