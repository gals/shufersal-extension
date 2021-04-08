<html>
<head>
  <title>מחשבון שופרסל לשותפים</title>

  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">

  <link href="css/materialdesignicons.min.css" rel="stylesheet">
  <link href="css/vuetify.min.css" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">

  <meta charset="utf-8">
  <link href="css/style.css" rel="stylesheet">
</head>
<body>
  <div id="app">
    <v-app>
      <v-main>
        <v-container>
          <v-subheader>רשימת משתתפים</v-subheader>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>שם המשתתף</th>
                  <th class="text-left">סה״כ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in people" :key="p.id">
                  <td>{{ p.name }}</td>
                  <td class="text-left">{{ p.total.toFixed(2) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-form>
            <v-text-field ref="nameTxt" v-model="name" label="שם המשתתף או המשתתפת"></v-text-field>
            <v-btn small color="primary" @click="addName">הוסף</v-btn>
          </v-form>

          <v-subheader>פריטים</v-subheader>
          <v-file-input small-chips 
            accept="*.json" 
            label="בחר קובץ קבלה"
            @change="readFile"></v-file-input>

          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>שם המוצר</th>
                  <th class="text-left">כמות</th>
                  <th class="text-left">מחיר ליחידה</th>
                  <th class="text-left">סה״כ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orderItems" :key="item.product.id">
                  <td>
                    <v-row class="py-4">
                      <strong>{{ item.product.name }}</strong>
                    </v-row>
                    <v-row>
                      <v-checkbox class="my-0 me-4"
                        v-for="p in people" :key="p.id"
                        v-model="item.peopleChecked[p.id]"
                        :label="p.name"
                        :color="p.color"
                        @change="item.check(p, people)"></v-checkbox>
                    </v-row>
                  </td>
                  <td class="text-left">{{ item.quantity }}</td>
                  <th class="text-left">{{ item.product.price.toFixed(2) }}</th>
                  <td class="text-left">{{ item.total().toFixed(2) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-main>
    </v-app>
  </div>
</body>
</html>