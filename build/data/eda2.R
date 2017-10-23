library(tidyverse)
library(readxl)

xwalk <- read_csv("/home/alec/Projects/Brookings/digitalization/build/data/initial_handoff/jacob/oes xwalk00.csv")

#show all obs with duplicated 2010 SOC codes
dup10obs <- xwalk %>% filter(duplicated(`2010 SOC code`)) %>% {filter(xwalk, `2010 SOC code` %in% .$`2010 SOC code`)}

#add on counts to 2000 and 2010 codes -- similar to the "*" and "**" notation in the crosswalk
#count00 indicates the number of splits each 2000 SOC code makes going from 2000 -> 2010
#likewise, count10 indicates the number of splits when going from 2010 -> 2000

n00 <- xwalk %>% inner_join(., group_by(., `2000 SOC code`) %>% summarise(., count00=n()) )
n10 <- xwalk %>% inner_join(., group_by(., `2010 SOC code`) %>% summarise(., count10=n()) )
xwalk_ <- inner_join(n00, n10)

bad_allocation <- xwalk_ %>% filter(count00==0 | count10==0 | (count00>1 & count10>1))

good <- xwalk_ %>% filter(!(`2000 SOC code` %in% bad_allocation$`2000 SOC code`) & !(`2010 SOC code` %in% bad_allocation$`2010 SOC code`))
bad <- xwalk_ %>% filter((`2000 SOC code` %in% bad_allocation$`2000 SOC code`) | (`2010 SOC code` %in% bad_allocation$`2010 SOC code`))
#nrow(good)+nrow(bad) == nrow(xwalk)

asdf <- as.data.frame(table(xwalk$`2010 SOC title`, xwalk$`2000 SOC title`)) %>% filter(Freq > 0)
dup00 <- xwalk[duplicated(xwalk$`2000 SOC code`), ]
