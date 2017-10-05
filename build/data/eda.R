library(tidyverse)

dat <- read_xlsx("/home/alec/Projects/Brookings/digitalization/build/data/Summary Data_RevisedOct1.xlsx", sheet=)

head(dat)
table(dat$high02)
s <- dat$high16 + dat$medium16 + dat$low16
unique(s)

dat2 <- dat %>% mutate(dsl02=(3*high02)+(2*medium02)+(low02), dsl16=(3*high16)+(2*medium16)+(low16))  

dat2$`Digital Skill level_2002`-dat2$dsl02
